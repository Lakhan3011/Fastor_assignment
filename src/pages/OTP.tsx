import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const VerifyOtp = () => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const mobileNumber = sessionStorage.getItem("mobileNumber");

    useEffect(() => {
        if (!mobileNumber) {
            navigate("/login");
        }
    }, [mobileNumber, navigate]);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take the last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            toast.error("Invalid OTP", {
                description: "Please enter all 4 digits",
                style: {
                    background: "red",
                    color: "white",
                },
            });
            return;
        }

        // Verify OTP (should be 123456)
        if (otpValue !== "123456") {
            toast.warning("Invalid OTP", {
                description: "Please enter the correct OTP: 123456",
                style: {
                    background: "red",
                    color: "white",
                }
            });
            return;
        }

        // Mark as verified and navigate
        sessionStorage.setItem("isVerified", "true");
        toast.success("OTP Verified", {
            description: "OTP verified successfully",
            style: {
                background: "green",
                color: "white",
            }
        });

        setTimeout(() => {
            navigate("/restaurants");
        }, 1000);
    };

    const handleResend = () => {
        toast.info("OTP Resent", {
            description: "A new verification code has been sent to your mobile number",
            style: {
                background: "blue",
                color: "white",
            }
        });
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-8">
                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Verify OTP
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the 4-digit code sent to {mobileNumber}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-3 justify-center">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                ref={(el) => { (inputRefs.current[index] = el) }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="h-14 w-14 text-center text-xl font-semibold"
                            />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium"
                        size="lg"
                    >
                        Verify OTP
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Didn't receive code?{" "}
                            <span className="font-medium text-primary">Resend</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
