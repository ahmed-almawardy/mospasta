from __future__ import annotations

import os
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Your Restaurant API",
    description="Demo API for the restaurant welcome page and bilingual menu.",
    version="1.0.0",
)

# Comma-separated origins are supported. For local development, the Next.js dev
# server normally runs on http://localhost:3000.
origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SocialLinks(BaseModel):
    facebook: str
    instagram: str
    tiktok: str


class RestaurantProfile(BaseModel):
    name: str
    welcome_en: str
    welcome_ar: str
    choose_language_en: str
    choose_language_ar: str
    tagline: str
    socials: SocialLinks


class MenuItem(BaseModel):
    id: str
    name: str
    description: str
    price: str = Field(description="Display-ready price, including currency")


class MenuCategory(BaseModel):
    id: str
    name: str
    items: list[MenuItem]


class MenuResponse(BaseModel):
    language: Literal["en", "ar"]
    currency: str
    categories: list[MenuCategory]


RESTAURANT = RestaurantProfile(
    name=os.getenv("RESTAURANT_NAME", "YOUR RESTAURANT"),
    welcome_en="Welcome to our table",
    welcome_ar="أهلاً وسهلاً بكم على مائدتنا",
    choose_language_en="Choose your preferred language",
    choose_language_ar="اختر اللغة التي تريحك",
    tagline="A little taste of home, made with love.",
    socials=SocialLinks(
        facebook=os.getenv("FACEBOOK_URL", "https://facebook.com/"),
        instagram=os.getenv("INSTAGRAM_URL", "https://instagram.com/"),
        tiktok=os.getenv("TIKTOK_URL", "https://tiktok.com/"),
    ),
)

MENUS: dict[str, MenuResponse] = {
    "en": MenuResponse(
        language="en",
        currency="EGP",
        categories=[
            MenuCategory(
                id="starters",
                name="To Begin",
                items=[
                    MenuItem(id="hummus", name="Classic Hummus", description="Creamy chickpeas, tahini, lemon, extra virgin olive oil.", price="EGP 95"),
                    MenuItem(id="tabbouleh", name="Garden Tabbouleh", description="Parsley, bulgur, ripe tomatoes, mint and fresh lemon.", price="EGP 110"),
                    MenuItem(id="baba-ghanoush", name="Smoky Baba Ghanoush", description="Charred eggplant, tahini, pomegranate and herbs.", price="EGP 105"),
                ],
            ),
            MenuCategory(
                id="mains",
                name="From the Grill",
                items=[
                    MenuItem(id="chicken-skewers", name="Herb-Grilled Chicken Skewers", description="Marinated chicken, fragrant rice, grilled tomato and warm flatbread.", price="EGP 285"),
                    MenuItem(id="mixed-grill", name="House Mixed Grill", description="A generous selection from the grill, served with rice and two mezze.", price="EGP 390"),
                    MenuItem(id="veggie-bowl", name="Mediterranean Garden Bowl", description="Seasonal vegetables, chickpeas, grains and lemon-tahini dressing.", price="EGP 220"),
                ],
            ),
            MenuCategory(
                id="desserts",
                name="Something Sweet",
                items=[
                    MenuItem(id="basbousa", name="Warm Basbousa", description="Semolina cake, light syrup and a hint of orange blossom.", price="EGP 95"),
                    MenuItem(id="fruit", name="Seasonal Fruit Plate", description="A fresh selection chosen daily.", price="EGP 120"),
                ],
            ),
        ],
    ),
    "ar": MenuResponse(
        language="ar",
        currency="EGP",
        categories=[
            MenuCategory(
                id="starters",
                name="مقبلات",
                items=[
                    MenuItem(id="hummus", name="حمص كلاسيكي", description="حمص كريمي، طحينة، ليمون وزيت زيتون بكر.", price="٩٥ ج.م"),
                    MenuItem(id="tabbouleh", name="تبولة طازجة", description="بقدونس وبرغل وطماطم طازجة ونعناع وليمون.", price="١١٠ ج.م"),
                    MenuItem(id="baba-ghanoush", name="بابا غنوج مدخن", description="باذنجان مشوي، طحينة، رمان وأعشاب طازجة.", price="١٠٥ ج.م"),
                ],
            ),
            MenuCategory(
                id="mains",
                name="من الشواية",
                items=[
                    MenuItem(id="chicken-skewers", name="أسياخ دجاج بالأعشاب", description="دجاج متبل، أرز عطري، طماطم مشوية وخبز طازج.", price="٢٨٥ ج.م"),
                    MenuItem(id="mixed-grill", name="مشويات مشكلة", description="تشكيلة من المشويات تُقدم مع الأرز وطبقين من المقبلات.", price="٣٩٠ ج.م"),
                    MenuItem(id="veggie-bowl", name="طبق خضروات البحر المتوسط", description="خضروات موسمية وحمص وحبوب مع صلصة الطحينة والليمون.", price="٢٢٠ ج.م"),
                ],
            ),
            MenuCategory(
                id="desserts",
                name="حلوى",
                items=[
                    MenuItem(id="basbousa", name="بسبوسة دافئة", description="كيك السميد بالشربات ولمسة من ماء زهر البرتقال.", price="٩٥ ج.م"),
                    MenuItem(id="fruit", name="طبق فواكه الموسم", description="تشكيلة طازجة يتم اختيارها يومياً.", price="١٢٠ ج.م"),
                ],
            ),
        ],
    ),
}


@app.get("/api/health")
def health() -> dict[str, str]:
    """Simple endpoint used to check whether the API is running."""
    return {"status": "ok", "service": "restaurant-api"}


@app.get("/api/restaurant", response_model=RestaurantProfile)
def get_restaurant() -> RestaurantProfile:
    """Return welcome-page text, branding and social links."""
    return RESTAURANT


@app.get("/api/menu/{language}", response_model=MenuResponse)
def get_menu(language: str) -> MenuResponse:
    """Return the sample menu in English or Arabic."""
    if language not in MENUS:
        raise HTTPException(status_code=404, detail="Unsupported language. Choose 'en' or 'ar'.")
    return MENUS[language]
