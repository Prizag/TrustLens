import { analyzeAndFetchReviews } from "../../../lib/analyzer";

export async function GET() {
  try {
    const reviews = await analyzeAndFetchReviews();

    return Response.json({ success: true, reviews });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
