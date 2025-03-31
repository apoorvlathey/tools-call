import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Common constants for API calls
const LATITUDE = 29.4516;
const LONGITUDE = 79.1015;
const TIMEZONE = "Asia/Kolkata";
const STRATEGY = "SuryaSiddhant";
const API_BASE_URL = "https://pavan1234-001-site1.jtempurl.com/api/Panchang";

// TypeScript type for Tithi response
type TithiResponse = {
  tithiNumber: number;
  tithiNameString: string;
  tithiEndTime: string;
  tithiEndGhatiPal: string;
  tithiFormattedEndTime: string;
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: {
      sunrise: tool({
        description: "Get the sunrise time for a given date",
        parameters: z.object({
          date: z
            .string()
            .or(z.date())
            .describe("The date to get the sunrise time for"),
        }),
        execute: async ({ date }) => {
          // Convert string to Date if needed
          const dateObj = typeof date === "string" ? new Date(date) : date;
          const formattedDate = dateObj.toISOString().split(".")[0];
          const url = `${API_BASE_URL}/sunrise?date=${formattedDate}&latitude=${LATITUDE}&longitude=${LONGITUDE}&timezone=${TIMEZONE}&strategy=${STRATEGY}`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch sunrise time: ${response.statusText}`
            );
          }

          const sunriseTime = await response.text();
          return {
            sunriseTime: sunriseTime.replace(/"/g, ""),
            date: formattedDate.split("T")[0],
            location: `${LATITUDE}, ${LONGITUDE}`,
            timezone: TIMEZONE,
          };
        },
      }),

      tithi: tool({
        description: "Get the tithi (lunar day) information for a given date",
        parameters: z.object({
          date: z
            .string()
            .or(z.date())
            .describe("The date to get the tithi information for"),
        }),
        execute: async ({ date }) => {
          // Convert string to Date if needed
          const dateObj = typeof date === "string" ? new Date(date) : date;
          const formattedDate = dateObj.toISOString().split(".")[0];
          const url = `${API_BASE_URL}/tithi?date=${formattedDate}&latitude=${LATITUDE}&longitude=${LONGITUDE}&timezone=${TIMEZONE}&strategy=${STRATEGY}`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch tithi information: ${response.statusText}`
            );
          }

          const tithiData: TithiResponse = await response.json();

          return {
            tithiNumber: tithiData.tithiNumber,
            tithiName: tithiData.tithiNameString,
            tithiEndTime: tithiData.tithiEndTime,
            tithiEndGhatiPal: tithiData.tithiEndGhatiPal,
            formattedEndTime: tithiData.tithiFormattedEndTime,
            date: formattedDate.split("T")[0],
            location: `${LATITUDE}, ${LONGITUDE}`,
            timezone: TIMEZONE,
          };
        },
      }),

      today: tool({
        description: "Get today's date",
        parameters: z.object({}),
        execute: async () => {
          const today = new Date();
          return {
            date: today.toISOString().split("T")[0],
            fullDate: today.toISOString(),
            day: today.getDate(),
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            dayOfWeek: today.toLocaleDateString("en-US", { weekday: "long" }),
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
