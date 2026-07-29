import { useState } from "react";

/**
 * useForm — hook generic buat kelola state form: values, errors, touched.
 * Dipisah dari komponen supaya logic form (bukan cuma validasi) juga reusable,
 * dan komponen NewProject.jsx cukup fokus nyusun tampilan.
 *
 * @param {Object} initialValues - nilai awal tiap field, misal { topic: "" }
 * @param {Object} validators - map nama field ke fungsi validasi, misal { topic: validateTopic }
 */
export function useForm(initialValues, validators) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function validateField(name, value) {
    const validator = validators[name];
    if (!validator) return null;
    return validator(value);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Kalau field ini sudah pernah di-blur sebelumnya, validasi ulang saat diketik
    // supaya error langsung hilang begitu user memperbaiki inputnya.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  function validateAll() {
    const newErrors = {};
    const newTouched = {};
    Object.keys(validators).forEach((name) => {
      newErrors[name] = validateField(name, values[name]);
      newTouched[name] = true;
    });
    setErrors(newErrors);
    setTouched(newTouched);

    return Object.values(newErrors).every((error) => error === null);
  }

  return { values, errors, touched, handleChange, handleBlur, validateAll };
}