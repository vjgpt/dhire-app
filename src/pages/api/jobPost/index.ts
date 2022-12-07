import {
  JobType,
  SalaryType,
  Skill,
  SkillLevel,
  Applicant,
} from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import prisma from 'prisma/client';

async function createJobPost(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  const {
    title,
    description,
    location,
    from,
    companyId,
    minSalary,
    maxSalary,
    salaryType,
    jobLevel,
    jobType,
    applicants,
    recruiterProfileUserId,
    skills,
    userId,
    benefits,
  } = req.body as {
    title: string;
    description: string[];
    location: string;
    from: Date;
    companyId: string;
    minSalary: number;
    maxSalary: number;
    salaryType: SalaryType;
    jobLevel: SkillLevel;
    jobType: JobType[];
    applicants?: Applicant[];
    recruiterProfileUserId: string;
    skills: Skill[];
    userId: string;
    benefits: string[];
  };
  try {
    const jobPost = await prisma.jobPost.create({
      data: {
        title,
        description,
        location,
        from,
        company: {
          connect: {
            id: companyId,
          },
        },
        applicants,
        minSalary,
        maxSalary,
        salaryType,
        jobLevel,
        jobType,
        RecruiterProfile: {
          connect: {
            userId: recruiterProfileUserId,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
        skills,
        benefits,
      },
    });
    res.status(200).json(jobPost);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
}

export default createJobPost;
