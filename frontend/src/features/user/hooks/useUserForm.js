import { useState } from 'react';
import { registerUser } from '../services/registerUser';

const useUserForm = (onSave, showSuccessPrompt) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    last_name: '',
    email: '',
    dni: '',
    image: null,
    is_active: true,
    is_staff: false,
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Intentar registrar el usuario
      await registerUser(formData);

      // Mostrar mensaje de éxito si se proporcionó la función
      if (showSuccessPrompt) {
        showSuccessPrompt('Usuario registrado con éxito');
      }

      // Resetear el formulario después de un registro exitoso
      setFormData({
        username: '',
        name: '',
        last_name: '',
        email: '',
        dni: '',
        image: null,
        is_active: true,
        is_staff: false,
        password: '',
        confirmPassword: '',
      });

      // Llamar a la función para cerrar el modal y actualizar la lista
      onSave();
    } catch (error) {
      // Mostrar mensajes de error detallados
      setError(error.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading, error };
};

export default useUserForm;
