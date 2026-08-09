const pool = require('../config/connectDB');

const ApplicationsModel = {
    getAllApplications: async (limit, offset) => {
        
        const dataQuery = `
            SELECT 
                a.application_id, 
                a.status,
                j.job_title,
                c.candidate_id,
                c.candidate_name,
                c.resume_url
            FROM Applications a
            LEFT JOIN candidates c ON c.candidate_id = a.candidate_id
            INNER JOIN jobs j ON j.id = a.job_id
            LIMIT $1 OFFSET $2;
        `;

        
        const countQuery = `SELECT COUNT(*) FROM Applications;`;

        const dataResult = await pool.query(dataQuery, [limit, offset]);
        const countResult = await pool.query(countQuery);

        return {
            applications: dataResult.rows,
            totalCount: parseInt(countResult.rows[0].count)
        };
    },

    getApplicationsById: async (application_id) => {
        const query = `
            SELECT 
                a.application_id, 
                a.status,
                j.job_title,
                c.candidate_id,
                c.candidate_name,
                c.resume_url
            FROM Applications a
            LEFT JOIN candidates c ON c.candidate_id = a.candidate_id
            INNER JOIN jobs j ON j.id = a.job_id
            WHERE a.application_id = $1;
        `;
        const result = await pool.query(query, [application_id]);
        return result.rows[0];
    },

    createNewApplication: async (candidate_id, job_id, status) => { 
        const query = `
            INSERT INTO Applications (candidate_id, job_id, status)
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const result = await pool.query(query, [candidate_id, job_id, status]);
        return result.rows[0];
    },

    EditApplication: async (application_id, candidate_id, job_id, status) => { 
        const UpdatedFields = [];
        const values = [];
        let placeholderIndex = 1;

        if (candidate_id !== undefined) { 
            UpdatedFields.push(`candidate_id = $${placeholderIndex++}`);
            values.push(candidate_id);
        }
        if (job_id !== undefined) { 
            UpdatedFields.push(`job_id = $${placeholderIndex++}`);
            values.push(job_id);
        }
        if (status !== undefined) { 
            UpdatedFields.push(`status = $${placeholderIndex++}`);
            values.push(status);
        }
        
        values.push(application_id);
        const sqlQuery = `
            UPDATE Applications 
            SET ${UpdatedFields.join(', ')} 
            WHERE application_id = $${placeholderIndex} 
            RETURNING *;
        `;
        
        const updatedJob = await pool.query(sqlQuery, values);
        return updatedJob.rows[0];
    },

    DeleteApplication: async (application_id) => { 
        const query = `DELETE FROM Applications WHERE application_id = $1 RETURNING *;`;
        const result = await pool.query(query, [application_id]);
        return result.rows[0];
    }
};

module.exports = ApplicationsModel;