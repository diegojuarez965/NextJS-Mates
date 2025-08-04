export const cloudinaryWidgetConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: 'ElSureñoUniversitario',
  sources: ['local'],
  multiple: false,
  cropping: true,
  folder: 'mates',
  resourceType: 'image',
  clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  styles: {
    palette: {
      window: '#ffffff',          // Fondo general
      sourceBg: '#f5f5f5',        // Fondo de pestañas (opcional)
      windowBorder: '#99B898',    // Borde de la ventana
      tabIcon: '#99B898',         // Icono de pestañas activas
      inactiveTabIcon: '#c0c0c0', // Icono de pestañas inactivas
      menuIcons: '#99B898',       // Íconos de menú
      link: '#99B898',            // Enlaces (como "desde URL")
      action: '#99B898',          // Botón "Browse" y otros
      inProgress: '#99B898',      // Barra de progreso
      complete: '#80C1B3',        // Color al completar
      error: '#d32f2f',           // Errores
      textDark: '#333333',        // Texto principal sobre blanco
      textLight: '#ffffff',       // Texto blanco sobre fondo verde
    },
  }
};
