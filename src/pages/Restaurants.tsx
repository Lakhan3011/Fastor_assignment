import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    image: string;
    location: string;
}

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const mobileNumber = sessionStorage.getItem("mobileNumber");
        const isVerified = sessionStorage.getItem("isVerified");
        const token = sessionStorage.getItem("token");

        if (!mobileNumber || !isVerified || !token) {
            navigate("/login");
            return;
        }

        // Simulate API call to fetch restaurants
        setTimeout(() => {
            const mockRestaurants: Restaurant[] = [
                {
                    id: "1",
                    name: "The Spice Route",
                    cuisine: "Indian, Chinese",
                    rating: 4.5,
                    deliveryTime: "30-40 mins",
                    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
                    location: "Koramangala"
                },
                {
                    id: "2",
                    name: "Pizza Palace",
                    cuisine: "Italian, Fast Food",
                    rating: 4.3,
                    deliveryTime: "25-35 mins",
                    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
                    location: "Indiranagar"
                },
                {
                    id: "3",
                    name: "Burger Hub",
                    cuisine: "American, Burgers",
                    rating: 4.6,
                    deliveryTime: "20-30 mins",
                    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
                    location: "HSR Layout"
                },
                {
                    id: "4",
                    name: "Sushi Station",
                    cuisine: "Japanese, Asian",
                    rating: 4.7,
                    deliveryTime: "35-45 mins",
                    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
                    location: "Whitefield"
                },
                {
                    id: "5",
                    name: "Taco Fiesta",
                    cuisine: "Mexican",
                    rating: 4.4,
                    deliveryTime: "25-35 mins",
                    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
                    location: "Jayanagar"
                },
                {
                    id: "6",
                    name: "The Coffee House",
                    cuisine: "Cafe, Beverages",
                    rating: 4.2,
                    deliveryTime: "15-25 mins",
                    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
                    location: "MG Road"
                }
            ];

            setRestaurants(mockRestaurants);
            setLoading(false);
        }, 1000);
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("mobileNumber");
        sessionStorage.removeItem("isVerified");
        navigate("/login");
    };

    const handleRestaurantClick = (restaurant: Restaurant) => {
        navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-64" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-1">
                            Nearby Restaurants
                        </h1>
                        <p className="text-muted-foreground">
                            Discover great places to eat
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {restaurants.map((restaurant) => (
                        <Card
                            key={restaurant.id}
                            className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                            onClick={() => handleRestaurantClick(restaurant)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md">
                                    <span className="text-sm font-semibold">⭐ {restaurant.rating}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    {restaurant.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {restaurant.cuisine}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        📍 {restaurant.location}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ⏱️ {restaurant.deliveryTime}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Restaurants;
