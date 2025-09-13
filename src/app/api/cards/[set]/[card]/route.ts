import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ set: string; card: string }> }
) {
  try {
    const { set, card } = await params;
    const response = await axios.get(
      `https://api.swu-db.com/cards/${set}/${card}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching card:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: "Failed to fetch card from API" },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
