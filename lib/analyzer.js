import {db} from "./prisma"
export async function analyzeAndFetchReviews() {
   const reviews = await db.review.findMany({
    include: {
      customer: true, // 🚀 include customer name & other details
    },
  });
  const updatedReviews = await Promise.all(
    reviews.map(async (review) => {
      if (review.response) {
        // Already analyzed
        return { ...review, ml: JSON.parse(review.response) };
      }

      // Call ML API
      const res = await fetch("https://bert-fake-review-api.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: review.comment }),
      });
      const data = await res.json();

      const mlResponse = { label: data.label, confidence: data.confidence };

      // Save result to DB
      await db.review.update({
        where: { id: review.id },
        data: { response: JSON.stringify(mlResponse) },
      });

      return { ...review, ml: mlResponse };
    })
  );

  return updatedReviews;
}
