/**
 * Componente Card reutilizable
 * Contenedor con estilos consistentes para contenido
 */

export default function Card({ 
  children, 
  onClick, 
  className = '',
  hover = false,
  ...props 
}) {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300';
  const hoverStyles = hover ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

