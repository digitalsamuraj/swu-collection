import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ set: string }> }
) {
  try {
    const { set } = await params;
    const response = await axios.get(`https://api.swu-db.com/cards/${set}`);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching cards:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: "Failed to fetch cards from API" },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
