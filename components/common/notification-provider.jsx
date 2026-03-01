"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const NotificationContext = createContext(null);

let _id = 0;
const genId = () => ++_id;

// ── Device detection ───────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const icons = {
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8.5L7 10.5L11 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5L14.5 13.5H1.5L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 6v3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7v4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  ),
};

// ── Config ─────────────────────────────────────────────────────────────────
const CONFIG = {
  error: {
    icon: icons.error,
    accent: "#EF4444",
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
  },
  success: {
    icon: icons.success,
    accent: "#22C55E",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  warning: {
    icon: icons.warning,
    accent: "#F59E0B",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  info: {
    icon: icons.info,
    accent: "#3B82F6",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
};

// ── Cart Toast ─────────────────────────────────────────────────────────────
function CartToast({
  id,
  product,
  quantity,
  duration = 4000,
  onDismiss,
  isMobile,
}) {
  const timerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(Date.now());

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(
    dragX,
    [-80, -20, 0, 20, 80],
    [0, 0.6, 1, 0.6, 0],
  );
  const dragScale = useTransform(dragX, [-80, 0, 80], [0.92, 1, 0.92]);

  const remaining = duration - elapsed;

  const startTimer = useCallback(() => {
    startedAt.current = Date.now();
    timerRef.current = setTimeout(() => onDismiss(id), remaining);
  }, [id, remaining, onDismiss]);

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    setElapsed((e) => e + (Date.now() - startedAt.current));
    setPaused(true);
  };

  const resumeTimer = () => {
    setPaused(false);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, []);

  const imageUrl = product?.images?.[0]?.url ?? "/product.png";
  const name = product?.name ?? "Item";
  const price = product?.basePrice ?? 0;

  const motionProps = isMobile
    ? {
        initial: { opacity: 0, y: -52, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: {
          opacity: 0,
          y: -36,
          scale: 0.94,
          transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
        },
        transition: { type: "spring", stiffness: 460, damping: 34, mass: 0.75 },
        drag: "x",
        dragConstraints: { left: 0, right: 0 },
        dragElastic: 0.2,
        onDragEnd: (_, info) => {
          if (Math.abs(info.offset.x) > 55 || Math.abs(info.velocity.x) > 450)
            onDismiss(id);
        },
        style: { x: dragX, opacity: dragOpacity, scale: dragScale },
      }
    : {
        initial: { opacity: 0, x: 52, scale: 0.93, filter: "blur(6px)" },
        animate: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
        exit: {
          opacity: 0,
          x: 36,
          scale: 0.96,
          filter: "blur(3px)",
          transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
        },
        transition: { type: "spring", stiffness: 360, damping: 30, mass: 0.85 },
      };

  return (
    <motion.div
      layout
      {...motionProps}
      onMouseEnter={isMobile ? undefined : pauseTimer}
      onMouseLeave={isMobile ? undefined : resumeTimer}
      className={`
        relative overflow-hidden select-none
        bg-white/96 backdrop-blur-2xl
        shadow-[0_2px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.05)]
        border border-white/60
        ${isMobile ? "w-full rounded-[18px]" : "w-[340px] rounded-2xl"}
      `}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        WebkitBackdropFilter: "blur(24px)",
        ...(motionProps.style || {}),
      }}
    >
      {/* Orange top accent pill */}
      <div className="flex justify-center pt-2.5 pb-0">
        <motion.div
          className="rounded-full"
          style={{ background: "#F97316", height: 3 }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 28, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Main content */}
      <div className="px-3 pt-2.5 pb-3">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.05,
                type: "spring",
                stiffness: 400,
                damping: 22,
              }}
            >
              <ShoppingBag className="w-3 h-3 text-orange-500" />
            </motion.div>
            <motion.p
              className="text-[11px] font-semibold text-orange-500 uppercase tracking-wide"
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 }}
            >
              Added to cart
            </motion.p>
          </div>
          <button
            onClick={() => onDismiss(id)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 active:scale-95 transition-all"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path
                d="M1 1L8 8M8 1L1 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Product row */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.22 }}
        >
          {/* Product image */}
          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
            <Image src={imageUrl} alt={name} fill className="object-cover" />
            {/* Qty badge */}
            {quantity > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white"
              >
                <span className="text-[9px] font-bold text-white">
                  {quantity}
                </span>
              </motion.div>
            )}
          </div>

          {/* Name + price */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 leading-tight line-clamp-2">
              {name}
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5">
              ₦{(price * quantity).toLocaleString()}
              {quantity > 1 && (
                <span className="text-gray-400">
                  {" "}
                  · {quantity}× ₦{price.toLocaleString()}
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* View cart CTA */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.2 }}
          className="mt-3"
        >
          <Link
            href="/cart"
            onClick={() => onDismiss(id)}
            className="flex items-center justify-center w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-[12px] font-semibold rounded-xl transition-colors gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            View Cart
          </Link>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black/4">
        <motion.div
          className="absolute inset-y-0 left-0 bg-orange-400"
          style={{ opacity: 0.7 }}
          initial={{ width: "100%" }}
          animate={paused ? {} : { width: "0%" }}
          transition={
            paused
              ? { duration: 0 }
              : { duration: remaining / 1000, ease: "linear" }
          }
        />
      </div>
    </motion.div>
  );
}

// ── Standard Toast ─────────────────────────────────────────────────────────
function Toast({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onDismiss,
  isMobile,
}) {
  const cfg = CONFIG[type] || CONFIG.info;
  const timerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(Date.now());

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(
    dragX,
    [-80, -20, 0, 20, 80],
    [0, 0.6, 1, 0.6, 0],
  );
  const dragScale = useTransform(dragX, [-80, 0, 80], [0.92, 1, 0.92]);

  const remaining = duration - elapsed;

  const startTimer = useCallback(() => {
    startedAt.current = Date.now();
    timerRef.current = setTimeout(() => onDismiss(id), remaining);
  }, [id, remaining, onDismiss]);

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    setElapsed((e) => e + (Date.now() - startedAt.current));
    setPaused(true);
  };

  const resumeTimer = () => {
    setPaused(false);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, []);

  const motionProps = isMobile
    ? {
        initial: { opacity: 0, y: -52, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: {
          opacity: 0,
          y: -36,
          scale: 0.94,
          transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
        },
        transition: { type: "spring", stiffness: 460, damping: 34, mass: 0.75 },
        drag: "x",
        dragConstraints: { left: 0, right: 0 },
        dragElastic: 0.2,
        whileDrag: { cursor: "grabbing" },
        onDragEnd: (_, info) => {
          if (Math.abs(info.offset.x) > 55 || Math.abs(info.velocity.x) > 450)
            onDismiss(id);
        },
        style: { x: dragX, opacity: dragOpacity, scale: dragScale },
      }
    : {
        initial: { opacity: 0, x: 52, scale: 0.93, filter: "blur(6px)" },
        animate: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
        exit: {
          opacity: 0,
          x: 36,
          scale: 0.96,
          filter: "blur(3px)",
          transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
        },
        transition: { type: "spring", stiffness: 360, damping: 30, mass: 0.85 },
      };

  return (
    <motion.div
      layout
      {...motionProps}
      onMouseEnter={isMobile ? undefined : pauseTimer}
      onMouseLeave={isMobile ? undefined : resumeTimer}
      className={`
        relative overflow-hidden select-none
        bg-white/96 backdrop-blur-2xl
        shadow-[0_2px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.05)]
        border border-white/60
        ${isMobile ? "w-full rounded-[18px]" : "w-[320px] rounded-2xl"}
      `}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        WebkitBackdropFilter: "blur(24px)",
        ...(motionProps.style || {}),
      }}
    >
      <div className="flex justify-center pt-2.5 pb-0">
        <motion.div
          className="rounded-full"
          style={{ background: cfg.accent, height: 3 }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 28, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="flex items-center gap-3 px-3 pt-2 pb-3">
        <motion.div
          className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: cfg.iconBg, color: cfg.iconColor }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.05,
            type: "spring",
            stiffness: 400,
            damping: 22,
          }}
        >
          {cfg.icon}
        </motion.div>

        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.22 }}
        >
          {title && (
            <p className="font-semibold text-[13px] leading-tight text-gray-900 truncate">
              {title}
            </p>
          )}
          {message && (
            <p
              className={`text-[12px] leading-snug text-gray-500 line-clamp-2 ${title ? "mt-0.5" : ""}`}
            >
              {message}
            </p>
          )}
        </motion.div>

        <button
          onClick={() => onDismiss(id)}
          className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 active:scale-95 transition-all"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path
              d="M1 1L8 8M8 1L1 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black/4">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: cfg.accent, opacity: 0.7 }}
          initial={{ width: "100%" }}
          animate={paused ? {} : { width: "0%" }}
          transition={
            paused
              ? { duration: 0 }
              : { duration: remaining / 1000, ease: "linear" }
          }
        />
      </div>

      {isMobile && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-[18px]"
          style={{
            opacity: useTransform(dragX, [-30, -8, 8, 30], [1, 0, 0, 1]),
            background: "rgba(239,68,68,0.06)",
          }}
        >
          <p className="text-[10px] font-bold text-red-400 tracking-widest uppercase">
            Swipe to dismiss
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Toast Container ────────────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`
        fixed z-[9999] flex flex-col pointer-events-none
        ${
          isMobile
            ? "top-[env(safe-area-inset-top,16px)] left-0 right-0 items-center gap-2 px-4 pt-4"
            : "top-5 right-5 items-end gap-2"
        }
      `}
      aria-live="polite"
      aria-atomic="false"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout="position"
            className={`pointer-events-auto ${isMobile ? "w-full" : ""}`}
          >
            {t.type === "cart" ? (
              <CartToast {...t} onDismiss={onDismiss} isMobile={isMobile} />
            ) : (
              <Toast {...t} onDismiss={onDismiss} isMobile={isMobile} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Provider ───────────────────────────────────────────────────────────────
export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    ({ type = "info", title, message, duration = 5000, product, quantity }) => {
      const id = genId();
      setToasts((prev) => [
        ...prev.slice(-4),
        { id, type, title, message, duration, product, quantity },
      ]);
      return id;
    },
    [],
  );

  const error = useCallback(
    (message, title = "Something went wrong") =>
      notify({ type: "error", title, message }),
    [notify],
  );
  const success = useCallback(
    (message, title = "Success") => notify({ type: "success", title, message }),
    [notify],
  );
  const warning = useCallback(
    (message, title = "Heads up") =>
      notify({ type: "warning", title, message }),
    [notify],
  );
  const info = useCallback(
    (message, title) => notify({ type: "info", title, message }),
    [notify],
  );

  return (
    <NotificationContext.Provider
      value={{ notify, error, success, warning, info, dismiss }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotification must be used within <NotificationProvider>",
    );
  return ctx;
}
