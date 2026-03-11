"use client";

import { useState, useEffect, useRef } from "react";
import type { SiteContent } from "@/lib/content";
import Image from "next/image";

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const fileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  async function save() {
    if (!content) return;
    setSaving(true);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function uploadImage() {
    if (!fileRef.current?.files?.length || !content) return;
    setUploading(true);

    const files = Array.from(fileRef.current.files);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const { src } = await res.json();
      content.gallery.images.push({ src, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") });
    }

    setContent({ ...content });
    fileRef.current.value = "";
    setUploading(false);
  }

  async function uploadHeroImage() {
    if (!heroFileRef.current?.files?.length || !content) return;
    setUploading(true);
    const file = heroFileRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const { src } = await res.json();
    content.hero.image = src;
    setContent({ ...content });
    heroFileRef.current.value = "";
    setUploading(false);
  }

  function removeImage(index: number) {
    if (!content) return;
    content.gallery.images.splice(index, 1);
    setContent({ ...content });
  }

  function update(path: string, value: string | number) {
    if (!content) return;
    const keys = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let obj: any = content;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setContent({ ...content });
  }

  function updateHighlight(index: number, value: string) {
    if (!content) return;
    content.property.highlights[index] = value;
    setContent({ ...content });
  }

  function addHighlight() {
    if (!content) return;
    content.property.highlights.push("");
    setContent({ ...content });
  }

  function removeHighlight(index: number) {
    if (!content) return;
    content.property.highlights.splice(index, 1);
    setContent({ ...content });
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Laden...</div>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "about", label: "Over" },
    { id: "property", label: "Huis" },
    { id: "gallery", label: "Gallerij" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              &larr; Terug naar site
            </a>
            <h1 className="text-xl font-bold">
              <span className="text-sky-400">CMS</span> — Casa Deleite
            </h1>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              saved
                ? "bg-green-600 text-white"
                : "bg-sky-500 hover:bg-sky-600 text-white hover:scale-105"
            } disabled:opacity-50`}
          >
            {saving ? "Opslaan..." : saved ? "Opgeslagen!" : "Opslaan"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-sky-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hero tab */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Hero sectie</h2>
            {/* Hero image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Achtergrond afbeelding</label>
              {content.hero.image ? (
                <div className="relative rounded-xl overflow-hidden mb-3">
                  <div className="relative aspect-[21/9]">
                    <Image src={content.hero.image} alt="Hero" fill className="object-cover" sizes="800px" />
                  </div>
                  <button
                    onClick={() => { content.hero.image = ""; setContent({...content}); }}
                    className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Verwijderen
                  </button>
                </div>
              ) : null}
              <input
                ref={heroFileRef}
                type="file"
                accept="image/*"
                onChange={uploadHeroImage}
                className="hidden"
                id="hero-upload"
              />
              <label
                htmlFor="hero-upload"
                className="inline-block cursor-pointer bg-gray-800 hover:bg-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {uploading ? "Uploaden..." : content.hero.image ? "Andere afbeelding kiezen" : "Afbeelding uploaden"}
              </label>
            </div>
            <Field label="Titel" value={content.hero.title} onChange={(v) => update("hero.title", v)} />
            <Field label="Ondertitel" value={content.hero.subtitle} onChange={(v) => update("hero.subtitle", v)} />
            <Field label="Tagline" value={content.hero.tagline} onChange={(v) => update("hero.tagline", v)} />
            <TextArea label="Beschrijving" value={content.hero.description} onChange={(v) => update("hero.description", v)} />
          </div>
        )}

        {/* About tab */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Over sectie</h2>
            <Field label="Titel" value={content.about.title} onChange={(v) => update("about.title", v)} />
            <TextArea label="Tekst" value={content.about.text} onChange={(v) => update("about.text", v)} />
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              {content.about.features.map((f, i) => (
                <div key={i} className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-800">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <Field label="Icon" value={f.icon} onChange={(v) => { f.icon = v; setContent({...content}); }} />
                    <Field label="Titel" value={f.title} onChange={(v) => { f.title = v; setContent({...content}); }} />
                  </div>
                  <TextArea label="Tekst" value={f.text} onChange={(v) => { f.text = v; setContent({...content}); }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property tab */}
        {activeTab === "property" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Huis details</h2>
            <Field label="Naam" value={content.property.name} onChange={(v) => update("property.name", v)} />
            <Field label="Locatie" value={content.property.location} onChange={(v) => update("property.location", v)} />
            <div className="grid grid-cols-3 gap-4">
              <NumberField label="Slaapkamers" value={content.property.bedrooms} onChange={(v) => update("property.bedrooms", v)} />
              <NumberField label="Badkamers" value={content.property.bathrooms} onChange={(v) => update("property.bathrooms", v)} />
              <NumberField label="Gasten" value={content.property.guests} onChange={(v) => update("property.guests", v)} />
            </div>
            <TextArea label="Beschrijving" value={content.property.description} onChange={(v) => update("property.description", v)} />
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Highlights</h3>
                <button onClick={addHighlight} className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                  + Toevoegen
                </button>
              </div>
              {content.property.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => updateHighlight(i, e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  <button
                    onClick={() => removeHighlight(i)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery tab */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Foto gallerij</h2>
            <Field label="Sectie titel" value={content.gallery.title} onChange={(v) => update("gallery.title", v)} />

            {/* Upload */}
            <div className="bg-gray-900 border-2 border-dashed border-gray-700 hover:border-sky-500 rounded-2xl p-8 text-center transition-colors">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={uploadImage}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-gray-400 font-medium">
                  {uploading ? "Uploaden..." : "Klik om foto's te uploaden"}
                </p>
                <p className="text-gray-600 text-sm mt-1">JPG, PNG, WebP — meerdere bestanden mogelijk</p>
              </label>
            </div>

            {/* Image grid */}
            {content.gallery.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {content.gallery.images.map((img, i) => (
                  <div key={i} className="group relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                    <div className="relative aspect-[4/3]">
                      <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="250px" />
                    </div>
                    <div className="p-3">
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) => {
                          img.alt = e.target.value;
                          setContent({ ...content });
                        }}
                        placeholder="Beschrijving"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact tab */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Contact informatie</h2>
            <Field label="Sectie titel" value={content.contact.title} onChange={(v) => update("contact.title", v)} />
            <TextArea label="Tekst" value={content.contact.text} onChange={(v) => update("contact.text", v)} />
            <Field label="E-mail" value={content.contact.email} onChange={(v) => update("contact.email", v)} />
            <Field label="Telefoon" value={content.contact.phone} onChange={(v) => update("contact.phone", v)} />
            <Field label="WhatsApp nummer (zonder +)" value={content.contact.whatsapp} onChange={(v) => update("contact.whatsapp", v)} />
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors resize-y"
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
      />
    </div>
  );
}
