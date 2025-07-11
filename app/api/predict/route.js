// app/api/predict/route.js
export async function POST(req) {
  try {
    const body = await req.json()

    const response = await fetch('https://bert-fake-review-api.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: body.text }),
    })

    const data = await response.json()

    return Response.json({ label: data.label, confidence: data.confidence })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
  }
}
