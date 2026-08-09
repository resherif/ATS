const pool = require('../config/connectDB');

const candidatesModel = {
    getAllCandidatesPaginated: async (limit, offset) => { 
        // ✅ 1. الـ Query نصية بدون تنفيذ مبكر
        const candidatesQuery = `
            SELECT c.candidate_id,
                   c.candidate_name,
                   c.email,
                   c.resume_url,
                   j.job_title,
                   COALESCE(
                       ARRAY_AGG(s.skill_name) FILTER (WHERE s.skill_name IS NOT NULL),
                       '{}'
                   ) AS skills
            FROM candidates c
            LEFT JOIN applications a ON c.candidate_id = a.candidate_id
            LEFT JOIN jobs j ON j.id = a.job_id
            LEFT JOIN candidate_skills cs ON cs.candidate_id = c.candidate_id
            LEFT JOIN skills s ON cs.skill_id = s.skill_id
            GROUP BY c.candidate_id, c.candidate_name, c.email, c.resume_url, j.job_title
            ORDER BY c.candidate_id ASC 
            LIMIT $1 OFFSET $2;
        `;

        const countQuery = `SELECT COUNT(*) FROM candidates`;

        // ✅ 2. تنفيذ الـ Queries بأسلوب صحيح
        const dataResult = await pool.query(candidatesQuery, [limit, offset]);
        const countResult = await pool.query(countQuery);

        return {
            candidates: dataResult.rows,
            totalCount: parseInt(countResult.rows[0].count, 10)
        };
    },

    getCandidateId: async (id) => { 
        const candidate = await pool.query(`
            SELECT c.candidate_id,
                   c.candidate_name,
                   c.email,
                   c.resume_url,
                   j.job_title,
                   a.status,
                   COALESCE(
                       ARRAY_AGG(s.skill_name) FILTER (WHERE s.skill_name IS NOT NULL),
                       '{}'
                   ) AS skills
            FROM candidates c
            LEFT JOIN applications a ON c.candidate_id = a.candidate_id
            LEFT JOIN jobs j ON j.id = a.job_id
            LEFT JOIN candidate_skills cs ON cs.candidate_id = c.candidate_id
            LEFT JOIN skills s ON cs.skill_id = s.skill_id
            WHERE c.candidate_id = $1
            GROUP BY c.candidate_id, c.candidate_name, c.email, c.resume_url, j.job_title, a.status
        `, [id]);

        return candidate.rows[0];
    },

    createCandidate: async (candidate_name, email, skills, resume_url) => {
        const client = await pool.connect();
        try { 
            await client.query('BEGIN');
            const candidatePart1 = await client.query(
                `INSERT INTO candidates (candidate_name, email, resume_url) VALUES ($1, $2, $3) RETURNING *`, 
                [candidate_name, email, resume_url]
            );
            const newCandidate = candidatePart1.rows[0];

            if (skills && skills.length > 0) { 
                const skillQueries = skills.map(skill_id => { 
                    return client.query(`INSERT INTO candidate_skills(candidate_id, skill_id) VALUES($1, $2)`, [newCandidate.candidate_id, skill_id]);
                });
                await Promise.all(skillQueries);
            }
            await client.query('COMMIT');
            return newCandidate;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    editCandidateInfo: async (candidate_id, candidate_name, email, skills = [], resume_url) => { 
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            let updatedCandidate = null;
            let placeHolderIndex = 1;
            const updatedFields = [];
            const values = [];

            if (candidate_name !== undefined) {
                updatedFields.push(`candidate_name = $${placeHolderIndex++}`);
                values.push(candidate_name);
            }
            if (email !== undefined) {
                updatedFields.push(`email = $${placeHolderIndex++}`);
                values.push(email);
            }
            if (resume_url !== undefined) {
                updatedFields.push(`resume_url = $${placeHolderIndex++}`);
                values.push(resume_url);
            }

            if (updatedFields.length > 0) {
                values.push(candidate_id);
                const sqlQuery = `UPDATE candidates 
                                  SET ${updatedFields.join(', ')} 
                                  WHERE candidate_id = $${placeHolderIndex} 
                                  RETURNING *`;

                const result = await client.query(sqlQuery, values);
                updatedCandidate = result.rows[0];
            } else { 
                const currentCandidate = await client.query(`SELECT * FROM candidates WHERE candidate_id=$1`, [candidate_id]);
                updatedCandidate = currentCandidate.rows[0];
            }

            if (skills !== undefined && Array.isArray(skills)) { 
                await client.query(`DELETE FROM candidate_skills WHERE candidate_id=$1`, [candidate_id]);
                if (skills.length > 0) { 
                    const skillQuery = skills.map(skill_id => {
                        return client.query(
                            `INSERT INTO candidate_skills (candidate_id, skill_id) VALUES ($1, $2)`, [candidate_id, skill_id]
                        );
                    });
                    await Promise.all(skillQuery);
                }
            }
            
            await client.query('COMMIT');
            return {
                ...updatedCandidate,
                skills: skills !== undefined ? skills : undefined
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    deleteCandidate: async (id) => { 
        // ✅ تم تصحيح الجدول ليكون candidates بدلاً من jobs
        const candidate = await pool.query(`DELETE FROM candidates WHERE candidate_id=$1 RETURNING *`, [id]);
        return candidate.rows[0];
    }
};

module.exports = candidatesModel;