export function validateTopic(value) {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return "Topik podcast wajib diisi.";
  }
  if (trimmed.length < 5) {
    return "Topik terlalu pendek, minimal 5 karakter.";
  }
  if (trimmed.length > 120) {
    return "Topik terlalu panjang, maksimal 120 karakter.";
  }
  return null;
}

export function validateHostCount(value) {
  const num = Number(value);

  if (!value) {
    return "Jumlah host wajib dipilih.";
  }
  if (Number.isNaN(num) || num < 1 || num > 4) {
    return "Jumlah host harus antara 1-4.";
  }
  return null;
}

export function validateLanguageStyle(value) {
  if (!value) {
    return "Gaya bahasa wajib dipilih.";
  }
  return null;
}

export function validateEmail(value) {
  const trimmed = value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (trimmed.length === 0) {
    return "Email wajib diisi.";
  }
  if (!emailPattern.test(trimmed)) {
    return "Format email tidak valid.";
  }
  return null;
}

export function validatePassword(value) {
  if (value.length === 0) {
    return "Password wajib diisi.";
  }
  if (value.length < 6) {
    return "Password minimal 6 karakter.";
  }
  return null;
}