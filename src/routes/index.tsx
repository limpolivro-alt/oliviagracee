import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowLeft, ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import mockup from "@/assets/mockup-producto.webp.asset.json";
import page1 from "@/assets/calendario-4-semanas.webp.asset.json";
import page2 from "@/assets/combinar-alimentacion-ejercicios.webp.asset.json";
import page3 from "@/assets/ejercicio-13-puente-gluteos.webp.asset.json";
import page4 from "@/assets/exercicio-14-plancha-lateral.webp.asset.json";
import page5 from "@/assets/exercicio-15-russian-twist.webp.asset.json";
import page6 from "@/assets/habitos-diarios.webp.asset.json";
import page7 from "@/assets/apelo-final.webp.asset.json";
import bonusBand from "@/assets/bonus-banda-elastica.jpg";
import bonusYoga from "@/assets/bonus-yoga-facial.jpg";
import bonusWeekly from "@/assets/bonus-acompanamiento-semanal-nuevo.jpg.asset.json";
import bonusWhatsapp from "@/assets/bonus-whatsapp-nuevo.jpg.asset.json";

const CHECKOUT = {
  essential: "https://pay.hotmart.com/Y106555914B?off=fh9947dk&checkoutMode=10",
  premium: "https://pay.hotmart.com/Y106555914B?off=oepgdigv&checkoutMode=10",
  offer: "https://pay.hotmart.com/Y106555914B?off=89l8pzji&checkoutMode=10",
};
const pages = [
  { src: page1.url, alt: "Calendario de cuatro semanas de la guía" },
  { src: page2.url, alt: "Página sobre alimentación, ejercicios y cuidado natural" },
  { src: page3.url, alt: "Página de ejercicio de puente de glúteos" },
  { src: page4.url, alt: "Página de ejercicio de plancha lateral" },
  { src: page5.url, alt: "Página de ejercicio Russian twist" },
  { src: page6.url, alt: "Página sobre hábitos diarios" },
  { src: page7.url, alt: "Página final de la guía" },
];
const essentials = ["Ebook principal", "Soporte por email", "Garantía de 7 días"];
const premium = ["Ebook principal", "Soporte por email", "Soporte por WhatsApp", "Atención personalizada por WhatsApp", "Acompañamiento semanal", "50 ejercicios con banda elástica", "Yoga facial", "Garantía de 60 días"];
const excluded = ["Soporte por WhatsApp", "Atención personalizada por WhatsApp", "Acompañamiento semanal", "50 ejercicios con banda elástica", "Yoga facial", "Garantía de 60 días"];
const bonuses = [
  { title: "50 ejercicios con banda elástica", text: "Una colección adicional de ejercicios para complementar tu rutina.", value: "US$40", image: bonusBand, alt: "Mujer realizando ejercicios con una banda elástica" },
  { title: "Yoga facial", text: "Rutinas adicionales enfocadas en el cuidado y bienestar facial.", value: "US$27", image: bonusYoga, alt: "Mujer practicando una rutina de yoga facial" },
  { title: "Acompañamiento semanal", text: "Orientación semanal para ayudarte a organizar tu proceso.", value: "US$140", image: bonusWeekly.url, alt: "Mujer organizando su rutina durante un acompañamiento semanal" },
  { title: "Atención personalizada por WhatsApp", text: "Un canal adicional para recibir orientación durante tu proceso.", value: "US$98", image: bonusWhatsapp.url, alt: "Mujer recibiendo atención personalizada por mensajería" },
];

const purchaseNames = [
  "María", "Valentina", "Camila", "Sofía", "Lucía", "Isabella", "Martina", "Daniela",
  "Paula", "Andrea", "Carolina", "Juliana", "Natalia", "Gabriela", "Valeria", "Fernanda",
  "Renata", "Carla", "Mónica", "Beatriz", "Alejandra", "Verónica", "Claudia", "Adriana",
  "Patricia", "Lorena", "Cecilia", "Diana", "Eva", "Rosa", "Elena", "Ana",
  "Inés", "Sara", "Julia", "Noelia", "Raquel", "Silvia", "Teresa", "Gloria",
  "Mariana", "Julieta", "Emilia", "Antonella", "Bianca", "Celeste", "Delfina", "Regina",
];
const notificationDelays = [3000, 7000, 10000];

function shuffleNames(items: string[]): string[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    copy[i] = copy[j]!;
    copy[j] = copy[i] === undefined ? copy[j]! : copy[i]!;
  }
  return copy;
}

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Cómo Recuperar la Firmeza del Busto Después de la Lactancia | Olivia Grace" },
    { name: "description", content: "Guía práctica de autocuidado con ejercicios, rutinas, alimentación y hábitos para mujeres después de la lactancia." },
    { property: "og:title", content: "Cómo Recuperar la Firmeza del Busto Después de la Lactancia | Olivia Grace" },
    { property: "og:description", content: "Guía práctica de autocuidado con ejercicios, rutinas, alimentación y hábitos para mujeres después de la lactancia." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "/" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }] }),
  component: Index,
});

function PlanLink({ children, href, onClick, outline = false }: { children: React.ReactNode; href?: string; onClick?: () => void; outline?: boolean }) {
  return <Button asChild={Boolean(href)} onClick={onClick} variant={outline ? "outline" : "default"} className="purchase-pulse w-full min-h-12 h-auto py-3 px-4 text-center whitespace-normal leading-snug font-bold text-sm tracking-normal shadow-none rounded-md hover:shadow-none">
    {href ? <a href={href} rel="noopener noreferrer">{children}</a> : <span>{children}</span>}
  </Button>;
}

function CountdownBar() {
  const [seconds, setSeconds] = useState(15 * 60);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const tick = window.setInterval(() => setSeconds((current) => current > 0 ? current - 1 : 0), 1000);
    const updateVisibility = () => setAtTop(window.scrollY <= 2);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  if (!atTop) return null;
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return <div className="countdown-bar" role="timer" aria-live="off">
    <span>OFERTA ESPECIAL TERMINA EN</span>
    <strong>{minutes}:{remainingSeconds}</strong>
  </div>;
}

function PurchaseActivity() {
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let deck: string[] = shuffleNames(purchaseNames);
    let lastShown = "";
    let showTimer: number | undefined;
    let hideTimer: number | undefined;

    const nextName = () => {
      if (deck.length === 0) {
        deck = shuffleNames(purchaseNames);
        const last = deck.at(-1);
        if (last === lastShown) {
          deck = [last ?? lastShown, ...deck.slice(0, deck.length - 1)];
        }
      }
      const next = deck.pop()!;
      lastShown = next;
      return next;
    };

    const schedule = () => {
      const delay = notificationDelays[Math.floor(Math.random() * notificationDelays.length)];
      showTimer = window.setTimeout(() => {
        setName(nextName());
        setVisible(true);
        hideTimer = window.setTimeout(() => {
          setVisible(false);
          schedule();
        }, 2800);
      }, delay);
    };

    schedule();
    return () => {
      if (showTimer !== undefined) window.clearTimeout(showTimer);
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  }, []);

  if (!name) return null;
  return <div className={`purchase-activity${visible ? " is-visible" : ""}`} role="status" aria-live="polite">
    <span className="purchase-activity-icon"><Check size={14} /></span>
    <span><strong>{name}</strong> acaba de comprar<span className="purchase-activity-note">Ejemplo</span></span>
  </div>;
}

function PageCarousel() {
  const autoScroll = useRef(AutoScroll({ playOnInit: false, speed: 0.75, stopOnInteraction: false, stopOnMouseEnter: false }));
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: "start", dragFree: true }, [autoScroll.current]);
  const [selected, setSelected] = useState(0);
  const update = useCallback(() => { if (embla) setSelected(embla.selectedScrollSnap()); }, [embla]);
  useEffect(() => { if (!embla) return; update(); embla.on("select", update); embla.on("reInit", update); return () => { embla.off("select", update); embla.off("reInit", update); }; }, [embla, update]);
  useEffect(() => {
    if (!embla || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    embla.plugins().autoScroll?.play();
  }, [embla]);
  return <div className="carousel">
    <div className="carousel-top"><p className="eyebrow">UN VISTAZO AL INTERIOR</p><h3>Así se ve tu guía</h3></div>
    <div className="carousel-stage">
      <Button className="carousel-arrow carousel-arrow-prev" variant="outline" size="icon" aria-label="Página anterior" onClick={() => embla?.scrollPrev()}><ArrowLeft /></Button>
      <div className="carousel-viewport" ref={viewportRef}><div className="carousel-track">{pages.map((page) => <div className="carousel-slide" key={page.src}><img src={page.src} alt={page.alt} loading="lazy" draggable="false" /></div>)}</div></div>
      <Button className="carousel-arrow carousel-arrow-next" variant="outline" size="icon" aria-label="Página siguiente" onClick={() => embla?.scrollNext()}><ArrowRight /></Button>
    </div>
    <div className="carousel-dots" aria-label="Navegación de páginas">{pages.map((page, i) => <Button key={page.src} variant="ghost" size="icon" aria-label={`Ver página ${i + 1}`} aria-current={selected === i ? "true" : undefined} className={selected === i ? "active" : ""} onClick={() => embla?.scrollTo(i)}><span /></Button>)}</div>
  </div>;
}

function Index() {
  const [offerOpen, setOfferOpen] = useState(false);
  useEffect(() => {
    if (!offerOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOfferOpen(false); };
    document.addEventListener("keydown", close);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = oldOverflow; };
  }, [offerOpen]);
  return <main>
    <CountdownBar />
    <header className="site-header"><a className="wordmark" href="#inicio" aria-label="Olivia Grace, inicio"><span className="brand-mark">OG</span><span>OLIVIA GRACE</span></a><a className="header-link" href="#planes">Ver planes <ArrowRight size={16}/></a></header>
    <section className="hero" id="inicio"><div className="hero-inner">
      <div className="hero-copy"><p className="eyebrow">UNA GUÍA PARA VOLVER A TI</p><h1>Descubre cómo recuperar la firmeza y cuidar tu busto después de la lactancia</h1><p className="hero-sub">Una guía práctica para ayudarte a organizar ejercicios, cuidados y hábitos de bienestar después de la lactancia.</p></div>
      <img className="hero-mockup" src={mockup.url} alt="Mockup original de la guía digital Olivia Grace en libro, tableta y celular" fetchPriority="high" />
      <div className="hero-action"><Button asChild size="lg" className="cta-button"><a href="#planes">QUIERO EMPEZAR A CUIDARME <ArrowRight size={18}/></a></Button><div className="micro-benefits"><span><Check/> Guía digital</span><span><Check/> Acceso desde tu celular</span><span><Check/> Plan práctico de 4 semanas</span></div></div>
    </div></section>

    <section className="section problem"><div className="container"><p className="eyebrow">UN NUEVO MOMENTO</p><h2>Después de la lactancia, tu cuerpo puede sentirse diferente</h2><p className="section-lead">Cambios en la apariencia del busto, sensación de pérdida de firmeza y dudas sobre qué hacer pueden hacer que muchas mujeres no sepan por dónde empezar.</p><div className="problem-grid"><div><span>01</span>Menos firmeza</div><div><span>02</span>Cambios en la apariencia</div><div><span>03</span>No saber por dónde empezar</div></div><p className="problem-close">Por eso reunimos diferentes prácticas de autocuidado en una guía sencilla y organizada.</p></div></section>

    <section className="section contents"><div className="container"><p className="eyebrow">TODO EN UN MISMO LUGAR</p><h2>¿Qué vas a recibir?</h2><p className="section-lead">Todo organizado en una sola guía para que puedas consultar el contenido y avanzar a tu propio ritmo.</p><div className="contents-grid">{["Ejercicios prácticos", "Rutinas organizadas", "Alimentación y recetas", "Cuidados de la piel", "Hábitos de bienestar", "Plan de 4 semanas"].map((item) => <div key={item}><span className="check-circle"><Check size={16}/></span>{item}</div>)}</div><PageCarousel /></div></section>

    <section className="section why"><div className="container why-grid"><div><p className="eyebrow">HECHO PARA TU DÍA A DÍA</p><h2>¿Por qué elegir esta guía?</h2><p className="section-lead">Una forma práctica de cuidar de ti, sin intentar hacerlo todo a la vez.</p></div><ul className="check-list">{["Todo organizado en un solo lugar", "Fácil de consultar", "Pensado para tu día a día", "Rutinas fáciles de seguir", "Plan organizado de 4 semanas"].map((x) => <li key={x}><Check size={19}/>{x}</li>)}</ul></div></section>

    <section className="section benefits"><div className="container"><p className="eyebrow">PASO A PASO</p><h2>Haz que tu rutina sea más sencilla</h2><div className="benefit-grid">{["Sabes por dónde empezar.", "Encuentras ejercicios y cuidados en un solo lugar.", "Puedes organizar tu rutina semanal.", "Avanzas poco a poco y a tu ritmo."].map((x, i) => <div key={x}><span>0{i+1}</span><p>{x}</p></div>)}</div></div></section>

    <section className="section bonuses"><div className="container"><p className="eyebrow">UN POCO MÁS PARA TI</p><h2>BONUS ESPECIALES QUE VAS A RECIBIR</h2><div className="bonus-grid">{bonuses.map((bonus) => <article className="bonus" key={bonus.title}><img src={bonus.image} alt={bonus.alt} loading="lazy" width={1024} height={768} /><div className="bonus-body"><h3>{bonus.title}</h3><p>{bonus.text}</p><p className="bonus-value"><s>{bonus.value}</s><strong>GRATIS</strong></p></div></article>)}</div></div></section>

    <section className="section plans" id="planes"><div className="container"><div className="plans-heading"><p className="eyebrow">ELIGE TU PLAN</p><h2>Empieza a cuidarte a tu manera</h2><p className="section-lead">Elige la opción que mejor se adapta a lo que necesitas hoy.</p></div><div className="plans-grid">
      <article className="plan-card"><div className="plan-title"><h3>Plan Esencial</h3><p>La guía para empezar a tu ritmo.</p></div><div className="price"><small>US$</small>9,90</div><ul className="plan-list">{essentials.map(x => <li key={x}><Check size={17}/>{x}</li>)}{excluded.map(x => <li className="excluded" key={x}><X size={16}/><s>{x}</s></li>)}</ul><Button className="plan-button purchase-pulse" onClick={() => setOfferOpen(true)}>QUIERO EL ESENCIAL <ArrowRight size={17}/></Button></article>
      <article className="plan-card premium-plan"><div className="plan-title"><span className="badge">MÁS COMPLETO</span><h3>Plan Premium</h3><p>Más recursos y acompañamiento.</p></div><div className="price"><small>US$</small>27,90</div><ul className="plan-list">{premium.map(x => <li key={x}><Check size={17}/>{x}</li>)}</ul><p className="plan-note">Si tienes dudas durante el proceso, podrás solicitar orientación personalizada por WhatsApp.</p><Button asChild className="plan-button purchase-pulse"><a href={CHECKOUT.premium}>QUIERO EL PREMIUM <ArrowRight size={17}/></a></Button></article>
    </div><div className="comparison"><h3>La diferencia, de un vistazo</h3><div><p><strong>Esencial</strong><span>Guía · Email · 7 días</span></p><p><strong>Premium</strong><span>Guía · Email · WhatsApp · Atención personalizada · Acompañamiento semanal · 50 ejercicios con banda · Yoga facial · 60 días</span></p></div></div></div></section>

    <section className="section testimonials"><div className="container"><p className="eyebrow">VOCES QUE TE ACOMPAÑAN</p><h2>Experiencias compartidas</h2><div className="testimonials-grid">{[
      ["Laura M.", "Después de la lactancia no sabía por dónde empezar. Me gustó tener los ejercicios y cuidados organizados en una sola guía."],
      ["Mariana R.", "Antes encontraba muchos consejos diferentes y terminaba sin seguir ninguno. Tener una rutina organizada me resultó mucho más sencillo."],
      ["Carolina S.", "Me gustó poder consultar la guía desde el celular y avanzar poco a poco, sin sentir que tenía que hacerlo todo de una vez."],
    ].map(([name, quote]) => <blockquote key={name}><p>“{quote}”</p><footer>{name}<small>Experiencia ilustrativa.</small></footer></blockquote>)}</div></div></section>

    <section className="section guarantee"><div className="container"><p className="eyebrow">COMPRA CON CONFIANZA</p><h2>Compra con tranquilidad</h2><div className="guarantee-grid"><div><span>07</span><p>Plan Esencial<strong>7 días de garantía</strong></p></div><div><span>60</span><p>Plan Premium<strong>60 días de garantía</strong></p></div></div><p className="disclaimer">Cada persona puede tener una experiencia diferente. El contenido está pensado como una guía de autocuidado y organización de rutinas.</p></div></section>

    <section className="section faq"><div className="container faq-layout"><div><p className="eyebrow">PREGUNTAS FRECUENTES</p><h2>¿Tienes dudas?</h2></div><div className="faq-list">{[
      ["¿Qué incluye el Plan Esencial?", "El ebook principal, soporte por email y 7 días de garantía."],
      ["¿Qué incluye el Plan Premium?", "El ebook, soporte por email y WhatsApp, atención personalizada, acompañamiento semanal, 50 ejercicios con banda elástica, yoga facial y 60 días de garantía."],
      ["¿Puedo acceder desde mi celular?", "Sí. Es una guía digital que puedes consultar desde tu celular."],
      ["¿Es un producto físico?", "No. Es un producto digital; no se envía ningún material físico."],
      ["¿Cuál es la diferencia entre Esencial y Premium?", "Premium añade WhatsApp, atención personalizada, acompañamiento semanal, ejercicios con banda, yoga facial y una garantía más larga."],
    ].map(([q,a]) => <details key={q}><summary>{q}<ChevronDown size={19}/></summary><p>{a}</p></details>)}</div></div></section>

    <section className="final-cta"><div className="container"><p className="eyebrow">TU MOMENTO EMPIEZA AQUÍ</p><h2>Empieza a dedicarte un poco más de tiempo</h2><p>Una rutina sencilla puede ser un buen comienzo.</p><Button asChild size="lg" className="cta-button"><a href="#planes">QUIERO EMPEZAR <ArrowRight size={18}/></a></Button></div></section>
    <footer className="site-footer"><span className="wordmark"><span className="brand-mark">OG</span><span>OLIVIA GRACE</span></span><p>© 2026 Olivia Grace — Todos los derechos reservados.</p></footer>
    <PurchaseActivity />
    {offerOpen && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOfferOpen(false); }}><div className="offer-modal" role="dialog" aria-modal="true" aria-labelledby="offer-title"><Button variant="ghost" size="icon" className="modal-close" aria-label="Cerrar oferta" onClick={() => setOfferOpen(false)}><X size={20}/></Button><p className="eyebrow">SOLO POR ESTA OCASIÓN</p><h2 id="offer-title">Oferta especial</h2><p>Puedes llevar el Plan Premium por solo US$12.</p><div className="offer-price"><s>US$27,90</s><strong>US$12</strong></div><ul>{["WhatsApp", "Atención personalizada", "Acompañamiento semanal", "50 ejercicios con banda", "Yoga facial", "Garantía de 60 días"].map(x => <li key={x}><Check size={15}/>{x}</li>)}</ul><PlanLink href={CHECKOUT.offer}>QUIERO EL PREMIUM POR US$12</PlanLink><a className="decline" href={CHECKOUT.essential}>No, continuar con el Esencial</a></div></div>}
  </main>;
}
