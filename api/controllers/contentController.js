import fs from "fs/promises";
import path from "path";

const contentPath = path.join(
  process.cwd(),
  "api/views/protectedContent.html"
);

export async function getProtectedContent(
  req,
  res
) {

  try {

    const protectedContent =
      await fs.readFile(
        contentPath,
        "utf8"
      );

    return res.status(200).json({

      success: true,

      content: protectedContent,
    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: "Internal server error.",
    });
  }
}