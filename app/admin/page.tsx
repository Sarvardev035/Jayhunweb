"use client";
import { useEffect, useState } from "react";
import type { Dish, SiteData } from "../../lib/site-data";

const blank: Dish = { id: "", name: "", description: "", price: 0, category: "Milliy taomlar", image: "", featured: false };
export default function AdminPage() {
  const [site, setSite] = useState<SiteData | null>(null); const [token, setToken] = useState(""); const [message, setMessage] = useState(""); const [dish, setDish] = useState(blank); const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/site")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data || !Array.isArray(data.dishes) || !Array.isArray(data.hotSales)) throw new Error(data?.error || "Admin ma’lumotlarini yuklab bo‘lmadi.");
        setSite(data as SiteData);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Admin ma’lumotlarini yuklab bo‘lmadi."));
  }, []);
  if (error) return <main className="container section"><div className="notice error-notice">{error} Serverni tekshiring va sahifani yangilang.</div></main>;
  if (!site) return <main className="container section"><p>Admin panel yuklanmoqda...</p></main>;
  const update = <K extends keyof SiteData>(key: K, value: SiteData[K]) => setSite({ ...site, [key]: value });
  const save = async () => { const response = await fetch("/api/site", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify(site) }); setMessage(response.ok ? "O‘zgarishlar saqlandi." : "Token noto‘g‘ri yoki ma’lumotlar yaroqsiz."); };
  const add = () => { if (!dish.name.trim() || !dish.image.trim()) return; update("dishes", [...site.dishes, { ...dish, id: crypto.randomUUID() }]); setDish(blank); };
  return <main className="admin-shell"><div className="container"><div className="admin-header"><div><span className="eyebrow">Faqat boshqaruv</span><h1>Admin panel</h1></div><a className="button button-dark" href="/">Public sayt →</a></div>{message && <div className="notice">{message}</div>}<div className="admin-grid"><section className="panel"><h2>Sayt matnlari</h2>{(["brand", "tagline", "description", "phone", "address", "hours"] as const).map((key) => <div className="field" key={key}><label>{key}</label>{key === "description" ? <textarea value={site[key]} onChange={(e) => update(key, e.target.value)} /> : <input value={site[key]} onChange={(e) => update(key, e.target.value)} />}</div>)}<div className="field"><label>Admin token</label><input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ADMIN_TOKEN" /></div><button className="button button-primary" onClick={save}>Saqlash</button></section><section className="panel"><h2>Taomlar va hot sales</h2><div className="admin-list">{site.dishes.map((item) => <div className="admin-dish" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><small>{item.category} · {item.price.toLocaleString("uz-UZ")} so‘m</small></div><button className="button" onClick={() => update("dishes", site.dishes.filter((d) => d.id !== item.id))}>O‘chirish</button></div>)}</div><h2 style={{ marginTop: 28 }}>Yangi taom</h2>{(["name", "description", "image"] as const).map((key) => <div className="field" key={key}><label>{key}</label><input value={dish[key]} onChange={(e) => setDish({ ...dish, [key]: e.target.value })} /></div>)}<div className="field"><label>Kategoriya</label><select value={dish.category} onChange={(e) => setDish({ ...dish, category: e.target.value })}>{site.categories.filter((c) => c !== "Barchasi").map((c) => <option key={c}>{c}</option>)}</select></div><div className="field"><label>Narx</label><input type="number" value={dish.price} onChange={(e) => setDish({ ...dish, price: Number(e.target.value) })} /></div><button className="button button-dark" onClick={add}>Taom qo‘shish</button></section></div></div></main>;
}
