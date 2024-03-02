import { db } from "@/db/prisma";

export const user = async (userId: string) => {
  try {
    const user = await db.users.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        isEmailVerify: true,
        stripePriceId: true,
        stripeSubscriptionId: true,
        ForgotPassword: true,
        role: true,
        status: true,
        subscriptionStatus: true,
        _count: {
          select: {
            File: true,
            ForgotPassword: true,
            Message: true,
          },
        },
      },
    });

    return user;
  } catch (err: any) {
    throw new Error("Some thing went wrong");
  }
};
