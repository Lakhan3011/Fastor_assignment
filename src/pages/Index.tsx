import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const mobileNumber = sessionStorage.getItem("mobileNumber");
        const isVerified = sessionStorage.getItem("isVerified");

        if (mobileNumber && isVerified) {
            navigate("/restaurants");
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-6 max-w-md px-4">
                <h1 className="text-3xl font-bold text-foreground">Loading...</h1>
            </div>
        </div>
    );
};

export default Index;
