import React, { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
export function Asset({ name, alt = "", className = "", ...props }) {
  return (
    <img
      src={"/assets/" + name + ".webp"}
      alt={alt}
      className={"asset " + className}
      decoding="async"
      {...props}
    />
  );
}
export function AssetButton({ name, label, onClick, className = "" }) {
  return (
    <button
      className={"image-button " + className}
      onClick={onClick}
      aria-label={label}
    >
      <Asset name={name} alt={label} />
    </button>
  );
}
export function More({ children, onClick }) {
  return (
    <button className="more" onClick={onClick}>
      {children}
      <ArrowRight size={21} />
    </button>
  );
}
export function Modal({ title, children, onClose }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <button className="close" onClick={onClose} aria-label="Close dialog">
        <X />
      </button>
      <h2 id="dialog-title">{title}</h2>
      {children}
      <button className="primary" onClick={onClose}>
        Close
      </button>
    </dialog>
  );
}
export function Rating({ rating, count }) {
  return (
    <span className="rating">
      <Asset name="star" />
      {rating} <span>({count})</span>
    </span>
  );
}
