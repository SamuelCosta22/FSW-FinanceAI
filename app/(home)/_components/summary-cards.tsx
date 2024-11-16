import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react";
import SummaryCard from "./summary-card";
import AddTransactionButton from "@/app/_components/add-transaction-button";
import { db } from "@/app/_lib/prisma";

interface SummaryCardsProps {
    month: string;
}

const SummaryCards = async ({month}: SummaryCardsProps) => {
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

    const expansesTotal = Number((await db.transaction.aggregate({
        where: {...where, type: "EXPENSE"},
        _sum: {amout: true}
    }))._sum?.amout);

    const balance = depositsTotal - investmentsTotal - expansesTotal;

    return (
        <div className="space-y-6">
            {/* PRIMEIRO CARD */}
            <Card>
                <CardHeader className="flex-row items-center gap-4">
                    <WalletIcon size={16} />
                    <p className="text-white opacity-70">Saldo</p>
                </CardHeader>
                <CardContent className="flex justify-between">
                    <p className="text-4xl font-bold">{Intl.NumberFormat("pt-BR", {
                    style:"currency",
                    currency:"BRL",
                }).format(balance)}</p>
                    <AddTransactionButton />
                </CardContent>
            </Card>

            {/* OUTROS CARDS */}
            <div className="grid grid-cols-3 gap-6">
                <SummaryCard icon={<PiggyBankIcon size={16} />} title="Investido" amount={investmentsTotal} />
                <SummaryCard icon={<TrendingUpIcon size={16} className="text-primary" />} title="Receita" amount={depositsTotal} />
                <SummaryCard icon={<TrendingDownIcon size={16} className="text-red-500" />} title="Desepesas" amount={expansesTotal} />
            </div>
        </div>
    );
}
 
export default SummaryCards;