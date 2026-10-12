"use client";
import { useEffect, useMemo, useState } from "react";
import type { SiteData } from "../lib/site-data";

const money = (value: number) => `${new Intl.NumberFormat("uz-UZ").format(value)} so‘m`;

export default function HomePage() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Barchasi");
  useEffect(() => {
    fetch("/api/site")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data || !Array.isArray(data.dishes) || !Array.isArray(data.hotSales)) {
          throw new Error(data?.error || "Sayt ma’lumotlarini yuklab bo‘lmadi.");
        }
        setSite(data as SiteData);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Sayt ma’lumotlarini yuklab bo‘lmadi."));
  }, []);
  const dishes = useMemo(() => site?.dishes.filter((d) => category === "Barchasi" || d.category === category) ?? [], [site, category]);
  if (error) return <main className="container section"><div className="notice error-notice">{error} Sahifani yangilang yoki server loglarini tekshiring.</div></main>;
  if (!site) return <main className="container section"><p>Yuklanmoqda...</p></main>;
  const sale = site.hotSales.find((item) => item.active);
  return <>
    <header className="site-header"><div className="container nav"><a className="logo" href="#"><span className="logo-mark">J</span><span>{site.brand}</span></a><nav className="nav-links"><a href="#menu">Menyu</a><a href="#about">Biz haqimizda</a><a href="#contact">Aloqa</a></nav><a className="button button-dark" href={`tel:${site.phone.replace(/\s/g, "")}`}>Stol band qilish</a></div></header>
    <main><section className="hero"><div className="container hero-grid"><div><span className="eyebrow">Sizni kutamiz</span><h1>Ta’mda <em>an’ana</em>, suhbatda samimiyat.</h1><p className="hero-copy">{site.description}</p><div className="hero-actions"><a className="button button-dark" href="#menu">Menyuni ko‘rish →</a><a className="button" href={`tel:${site.phone.replace(/\s/g, "")}`}>☎ {site.phone}</a></div></div><div className="hero-photo"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85" alt="Jayhun taomi" /></div></div></section>
      {sale && <section className="section"><div className="container"><div className="hot-banner"><img src={sale.image} alt={sale.name} /><div className="hot-content"><span className="eyebrow">Bugungi issiq taklif</span><h2>{sale.name}</h2><p>{sale.description}</p><div><span className="price">{money(sale.price)}</span><span className="old-price">{money(sale.oldPrice)}</span></div></div></div></div></section>}
      <section id="menu" className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Mazali tanlov</span><h2>Sevimli taomlar</h2></div><p>Har kuni yangi mahsulotlar va Jayhun oshpazlarining mehr bilan tayyorlangan taomlari.</p></div><div className="categories">{site.categories.map((item) => <button key={item} className={`category ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="dish-grid">{dishes.map((dish) => <article className="dish-card" key={dish.id}><img src={dish.image} alt={dish.name} /><div className="dish-info"><span className="dish-category">{dish.category}</span><h3>{dish.name}</h3><p>{dish.description}</p><div className="dish-meta"><span className="price">{money(dish.price)}</span>{dish.featured && <span>★</span>}</div></div></article>)}</div></div></section>
      <section id="about" className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Jayhun haqida</span><h2>Dasturxonga marhamat</h2></div></div><div className="info-grid"><div className="info-card"><span>Manzil</span><p>{site.address}</p></div><div className="info-card"><span>Ish vaqti</span><p>{site.hours}</p></div><div id="contact" className="info-card"><span>Telefon</span><p>{site.phone}</p></div></div></div></section>
    </main><footer><div className="container footer-row"><p>© {new Date().getFullYear()} {site.brand}</p><p>{site.tagline}</p></div></footer>
  </>;
}
