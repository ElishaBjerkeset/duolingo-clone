import { cache } from "react";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { challengeProgress, courses, units, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export const getUserProgress = cache(async () => {
    const {userId} = await auth();

    if(!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true,
        },
    });

    return data;
});

export const getUnits = cache(async () => {
    const {userId} = await auth();
    const userProgress = await getUserProgress();

    if(!userId || !userProgress?.activeCourseId) {
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            }
                        },
                    },
                },
            },
        },
    });

    const normalizedData = data.map((unit) => {    //Loop within a loop. Use drizzle queries or SQl for efficiency
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress && challenge.challengeProgress.length > 0 && 
                challenge.challengeProgress.every((progress) => progress.completed);
            });

            return {...lesson, completed: allCompletedChallenges}
        });
        return {...unit, lessons:lessonsWithCompletedStatus}
    });

    return normalizedData;
});

export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();

    return data;
});

export const getCourseById = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
    });

    return data;
});