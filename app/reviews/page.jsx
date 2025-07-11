"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Star,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
      const res = await fetch("/api/review");
const data = await res.json();

const parsed = data.reviews.map((review) => {
  const response = review.response
    ? JSON.parse(review.response)
    : { label: "unknown", confidence: 0 };

          return {
            ...review,
            status: response.label === "genuine" ? "authentic" : "suspicious",
            confidence: response.confidence,
            flags:
              response.label !== "genuine"
                ? ["ML flagged as suspicious"]
                : [],
          };
        });

        setReviews(parsed);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === "all") return true;
    return review.status === activeTab;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return <div className="p-6 text-black">🔄 Loading reviews...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-none">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-black ml-10">
          Review Analysis
        </h1>
        <p className="text-muted-foreground text-sm md:text-base ml-10">
          Monitor and analyze customer reviews for authenticity and sentiment
        </p>
      </div>

      <Card className="gradient-card w-full">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-black font-bold">
            Review Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6 p-3 ">
              <TabsList className="grid w-full lg:w-auto grid-cols-3 bg-slate-100 ">
                {["all", "authentic", "suspicious"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`text-xs md:text-sm text-black ${
                      activeTab === tab
                        ? "bg-white rounded-md p-1"
                        : ""
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex flex-wrap gap-4 bg-white">
                <div className="relative flex-1 lg:flex-none bg-white mr-10">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground bg-white" />
                  <Input
                    placeholder="Search reviews..."
                    className="pl-8 w-full lg:w-[200px] text-sm bg-white border-slate-300 text-slate-400"
                  />
                </div>

                <Select defaultValue="date">
                  <SelectTrigger className="w-[120px] text-sm text-black bg-white border-slate-300 ">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date" className="text-black">
                      Date
                    </SelectItem>
                    <SelectItem value="rating" className="text-black">
                      Rating
                    </SelectItem>
                    <SelectItem value="product" className="text-black">
                      Product
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder(
                      sortOrder === "desc" ? "asc" : "desc"
                    )
                  }
                  className="shrink-0 bg-white text-black border-slate-300"
                >
                  {sortOrder === "desc" ? (
                    <ChevronDown className="h-5 w-5 ml-2" />
                  ) : (
                    <ChevronUp className="h-5 w-5 ml-2" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 bg-white text-black border-slate-300"
                >
                  <Filter className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="m-0 text-black">
              <div className="space-y-4">
                {sortedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div
      className={`p-4 rounded-lg border w-full ${
        review.status === "authentic"
          ? "bg-blue-50 border-blue-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-medium truncate text-sm md:text-base">
            {review.title || review.product}
          </h3>
          <div className="flex shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 md:h-4 md:w-4 ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ">
          <Badge
            variant={
              review.status === "authentic"
                ? "outline"
                : "destructive"
            }
            className={`text-xs w-35 p-1 border-slate-300 flex ${
              review.status === "suspicious"
                ? "bg-red-600 border-slate-100"
                : ""
            }`}
          >
            {review.status === "authentic" ? (
              <>
                <CheckCircle className="h-4 w-4 md:h-3 md:w-3 mr-1 text-blue-600 " />
                <p className="font-bold">Authentic</p>
              </>
            ) : (
              <div className="flex">
                <AlertCircle className="h-2 w-2 md:h-3 md:w-3 mr-1 text-white mt-0.5" />
                <p className="font-bold text-white">Suspicious</p>
              </div>
            )}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <p className="text-sm mb-2 break-words">{review.comment}</p>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground">
          By: {review.customer.name}
        </span>

        {review.flags.length > 0 && (
          <div className="flex flex-wrap gap-1 text-black font-bold">
            {review.flags.map((flag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs p-1 bg-slate-100 border-slate-100 text-black"
              >
                {flag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
