const pool = require('../config/connectDB');

const JobsModel = {
    getAllJobsPaginated: async (limit, offset) => {
        
        const jobsQuery = await pool.query(`SELECT * FROM jobs ORDER BY id DESC LIMIT $1 OFFSET $2`, [limit, offset]);
        const countQuery = await pool.query(`SELECT COUNT(*) FROM jobs`);

        return {
            data: jobsQuery.rows,
            totalCount: parseInt(countQuery.rows[0].count)
        };
    },

    getJobById: async (id) => {
        const job = await pool.query(`SELECT * FROM jobs WHERE id=$1`, [id]);
        return job.rows[0];
    },

    createNewJob: async (job_title, description, status, requirements, experience_level, salary_range, employment_type, department, location) => { 
        const newJob = await pool.query(
            `INSERT INTO jobs 
            (job_title, description, status, requirements, experience_level, salary_range, employment_type, department, location)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [job_title, description, status, requirements, experience_level, salary_range, employment_type, department, location]
        );
        return newJob.rows[0];
    },

    EditJob: async (id, job_title, description, status, requirements, experience_level, salary_range, employment_type, department, location) => { 
        const UpdatedFields = [];
        const values = [];
        let placeholderIndex = 1;

        if (job_title !== undefined) { UpdatedFields.push(`job_title = $${placeholderIndex++}`); values.push(job_title); }
        if (description !== undefined) { UpdatedFields.push(`description = $${placeholderIndex++}`); values.push(description); }
        if (status !== undefined) { UpdatedFields.push(`status = $${placeholderIndex++}`); values.push(status); }
        if (requirements !== undefined) { UpdatedFields.push(`requirements = $${placeholderIndex++}`); values.push(requirements); }
        if (experience_level !== undefined) { UpdatedFields.push(`experience_level = $${placeholderIndex++}`); values.push(experience_level); }
        if (salary_range !== undefined) { UpdatedFields.push(`salary_range = $${placeholderIndex++}`); values.push(salary_range); }
        if (employment_type !== undefined) { UpdatedFields.push(`employment_type = $${placeholderIndex++}`); values.push(employment_type); }
        if (department !== undefined) { UpdatedFields.push(`department = $${placeholderIndex++}`); values.push(department); }
        if (location !== undefined) { UpdatedFields.push(`location = $${placeholderIndex++}`); values.push(location); }

        values.push(id);
        const sqlQuery = `UPDATE jobs SET ${UpdatedFields.join(', ')} WHERE id=$${placeholderIndex} RETURNING *`;
        const updatedJob = await pool.query(sqlQuery, values);

        return updatedJob.rows[0];
    },

    DeleteJob: async (id) => { 
        const deletedJobs = await pool.query(`DELETE FROM jobs WHERE id=$1 RETURNING *`, [id]);
        return deletedJobs.rows[0];
    }
};

module.exports = JobsModel;