import { NextResponse } from "next/server";
import axios from "axios";
export async function GET(req: Request) {
  const username = req.url.split("/").pop();
  const query = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        starRating
        reputation
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
  }
`;

  const variables = {
    username,
  };

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      JSON.stringify({
        query,
        variables,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    return NextResponse.json({
      status: 200,
      message: "User data fetched successfully",
      data: response.data.data.matchedUser,
      contestData: response.data.data.userContestRanking,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch user data",
      error: err,
    });
  }
}
