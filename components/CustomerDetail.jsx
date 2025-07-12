'use client';

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar } from "lucide-react";
import CustomerTrustPassport from "@/components/CustomerTrustPassport";

export default function CustomerDetail({ customer }) {
    // You can move the trust score logic here if you prefer,
    // or keep it simpler for now.

    const getProgressColor = (score) => {
        if (score >= 80) return "bg-sky-500";
        if (score >= 50) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Avatar className="h-12 w-12 md:h-16 md:w-16">
                    <AvatarImage src={customer.profileImage || `/placeholder.svg?text=${customer.name.charAt(0)}`} />
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-black">{customer.name}</h2>
                    <p className="text-muted-foreground">{customer.email}</p>
                    <div className="flex gap-3 mt-2">
                        {customer.address && (
                            <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {customer.address}
                            </div>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* TrustLens Integration */}
            {customer.walletAddress ? (
                <CustomerTrustPassport customerWalletAddress={customer.walletAddress} />
            ) : (
                <div className="p-4 border border-dashed rounded-lg text-center text-sm text-gray-500">
                    This customer has not linked a Web3 wallet.
                </div>
            )}
        </div>
    );
}