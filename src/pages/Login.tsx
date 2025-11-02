import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth";

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState("");
    const navigate = useNavigate();

    const mutation = useMutation(({
        mutationFn: registerUser,
        onSuccess: (data) => {
            toast.success(data.status, {
                description: "Mobile number registered successfully",
                position: "top-center",
                style: {
                    background: "green",
                    color: "white",
                }
            });
            sessionStorage.setItem("mobileNumber", mobileNumber);
            setMobileNumber("");
            navigate("/verify-otp");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "resigter error");
        }
    }))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate mobile number (10 digits)
        if (!/^\d{10}$/.test(mobileNumber)) {
            toast.warning("Invalid Mobile Number", {
                description: "Please enter a valid 10-digit mobile number",
                position: "top-center",
                style: {
                    background: "red",
                    color: "white",
                }
            });

            return;
        }
        mutation.mutate({ dial_code: "+91", phone: mobileNumber })
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-8 font-['Poppins']">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Enter Your Mobile Number
                    </h1>
                    <p className="text-sm text-muted-foreground ">
                        We will send you the 4 digit verification code
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            type="tel"
                            placeholder="Enter your mobile number"
                            value={mobileNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="h-12 text-base"
                            maxLength={10}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-base bg-[#FF6D6A] font-medium"
                        size="lg"
                    >
                        Send Code
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
