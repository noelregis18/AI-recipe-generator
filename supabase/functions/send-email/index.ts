
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactFormData = await req.json();

    if (!name || !email || !message) {
      throw new Error("Missing required fields");
    }

    // Send email to Noel
    const emailResponse = await resend.emails.send({
      from: "Culinary Photo Genius <onboarding@resend.dev>",
      to: ["noel.regis04@gmail.com"],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div>
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Also send a confirmation email to the user
    await resend.emails.send({
      from: "Culinary Photo Genius <onboarding@resend.dev>",
      to: [email],
      subject: "We've received your message!",
      html: `
        <div>
          <h1>Thank you for reaching out!</h1>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you soon.</p>
          <p>Your message:</p>
          <p><em>${message}</em></p>
          <p>Best regards,<br>Noel Regis</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
