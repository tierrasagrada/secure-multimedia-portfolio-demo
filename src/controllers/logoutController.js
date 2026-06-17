export function logout(
  req,
  res
) {
    res.clearCookie(
        "access_token",
        {
        httpOnly: true,
        secure:
            process.env.NODE_ENV ===
            "production",

        sameSite: "strict"
        }
    );

    return res.status(200).json({

        success: true,

        message:
        "Session closed."
    });    
}