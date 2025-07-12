'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerListItem({ customer, isSelected, onClick }) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage src={customer.profileImage || `/placeholder.svg?text=${customer.name.charAt(0)}`} />
          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2">
            <p className="font-medium truncate text-sm">{customer.name}</p>
            {customer.avgTrustScore !== null && (
              <span className="text-xs text-muted-foreground">{Number(customer.avgTrustScore)}/100</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
        </div>
      </div>
    </div>
  );
}