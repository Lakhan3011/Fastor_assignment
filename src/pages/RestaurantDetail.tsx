import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Download } from "lucide-react";
import { toast } from "sonner";
import fastorLogo from "@/assets/fastor-logo.png";

interface Restaurant {
    id: string;
    name: string;
    image: string;
}

const RestaurantDetail = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 }); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [logoSize] = useState(100); // logo size in pixels

    useEffect(() => {
        if (location.state?.restaurant) {

            setRestaurant(location.state.restaurant);
        } else {
            navigate("/restaurants");
        }
    }, [location, navigate]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !restaurant) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = restaurant.image;

        img.onload = () => {
            canvas.width = 800;
            canvas.height = 600;

            // Draw restaurant image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw Fastor logo
            const logo = new Image();
            logo.src = fastorLogo;
            logo.onload = () => {
                // converts percentage pos into pixel pos
                const logoX = (logoPosition.x / 100) * canvas.width - logoSize / 2;
                const logoY = (logoPosition.y / 100) * canvas.height - logoSize / 2;
                ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                setImageLoaded(true);
            };
        };
    };

    useEffect(() => {
        if (restaurant) {
            drawCanvas();
        }
    }, [restaurant, logoPosition]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // limits the position to 10% to 90% of the canvas
        setLogoPosition({
            x: Math.max(10, Math.min(90, x)),
            y: Math.max(10, Math.min(90, y))
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = () => {
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;

        setLogoPosition({
            x: Math.max(10, Math.min(90, x)),
            y: Math.max(10, Math.min(90, y))
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleShare = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const file = new File([blob], `${restaurant?.name}-fastor.png`, {
                    type: "image/png"
                });

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: restaurant?.name,
                        text: `Check out ${restaurant?.name} with Fastor!`
                    });

                    toast.success("Shared successfully!", {
                        description: "Image shared to your selected app",
                        style: {
                            background: "green",
                            color: "white",
                        }
                    });
                } else {
                    // Fallback: download the image
                    handleDownload();
                }
            });
        } catch (error) {
            toast.error("Sharing failed", {
                description: "Your browser doesn't support sharing. Image will be downloaded instead.",
                style: {
                    background: "red",
                    color: "white",
                }
            });
            handleDownload();
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = `${restaurant?.name}-fastor.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        toast.success("Image downloaded!", {
            description: "Check your downloads folder",
            style: {
                background: "green",
                color: "white",
            }
        });
    };

    if (!restaurant) return null;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <button
                    onClick={() => navigate("/restaurants")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Restaurants
                </button>

                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {restaurant.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Drag the Fastor logo to reposition it on the image
                        </p>
                    </div>

                    <div
                        ref={containerRef}
                        className="relative w-full max-w-2xl mx-auto aspect-4/3 bg-muted rounded-lg overflow-hidden cursor-move"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                        />
                        <img
                            src={fastorLogo}
                            alt="Fastor Logo"
                            className="absolute pointer-events-none"
                            style={{
                                left: `${logoPosition.x}%`,
                                top: `${logoPosition.y}%`,
                                transform: "translate(-50%, -50%)",
                                width: `${logoSize}px`,
                                height: `${logoSize}px`
                            }}
                        />
                        {isDragging && (
                            <div className="absolute inset-0 bg-background/10 pointer-events-none" />
                        )}
                    </div>

                    <canvas
                        ref={canvasRef}
                        className="hidden"
                        width={800}
                        height={600}
                    />

                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={handleShare}
                            disabled={!imageLoaded}
                            className="gap-2"
                            size="lg"
                        >
                            <Share2 className="h-4 w-4" />
                            Share Image
                        </Button>
                        <Button
                            onClick={handleDownload}
                            disabled={!imageLoaded}
                            variant="outline"
                            className="gap-2"
                            size="lg"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetail;
