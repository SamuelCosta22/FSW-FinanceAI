import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "./types";

export const getDashboard = async(month: string) => {
    const where = {
        date: {
            gte: new Date(`2024-${month}-01`),
            lt: new Date(`2024-${month}-31`)
        }
    }

    const depositsTotal = Number((await db.transaction.aggregate({
        where: {...where, type: "DEPOSIT"},
        _sum: {amout: true}
    }))._sum?.amout);

    const investmentsTotal = Number((await db.transaction.aggregate({
        where: {...where, type: "INVESTMENT"},
        _sum: {amout: true}
    }))._sum?.amout);

    const expensesTotal = Number((await db.transaction.aggregate({
        where: {...where, type: "EXPENSE"},
        _sum: {amout: true}
    }))._sum?.amout);

    const balance = depositsTotal - investmentsTotal - expensesTotal;

    const transactionsTotal = Number((
        await db.transaction.aggregate({
        where,
        _sum: { amout: true },
        })
    )._sum.amout);

    const typesPercentage: TransactionPercentagePerType = {
        [TransactionType.DEPOSIT]: Math.round(
          (Number(depositsTotal || 0) / Number(transactionsTotal)) * 100,
        ),
        [TransactionType.EXPENSE]: Math.round(
          (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
        ),
        [TransactionType.INVESTMENT]: Math.round(
          (Number(investmentsTotal || 0) / Number(transactionsTotal)) * 100,
        ),
      };

    return {
        balance, depositsTotal, investmentsTotal, expensesTotal, typesPercentage,
    }
}