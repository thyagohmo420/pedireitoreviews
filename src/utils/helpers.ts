export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const getNivelColor = (nivel: string): string => {
  switch (nivel) {
    case 'Iniciante': return 'text-gray-600 bg-gray-100';
    case 'Bronze': return 'text-amber-700 bg-amber-100';
    case 'Prata': return 'text-gray-700 bg-gray-200';
    case 'Ouro': return 'text-yellow-700 bg-yellow-100';
    case 'Diamante': return 'text-purple-700 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Aguardando Contato': return 'text-orange-700 bg-orange-100';
    case 'Em Negociação': return 'text-purple-700 bg-purple-100';
    case 'Fechado': return 'text-green-700 bg-green-100';
    case 'Cancelado': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};

export const animateCounter = (
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
) => {
  const startTime = performance.now();
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = Math.floor(start + (end - start) * progress);
    callback(current);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

export const getRankColor = (rank: string) => {
  switch (rank) {
    case 'Ouro':
      return 'text-yellow-700 bg-yellow-100';
    case 'Prata':
      return 'text-gray-700 bg-gray-100';
    case 'Bronze':
      return 'text-orange-700 bg-orange-100';
    case 'Diamante':
      return 'text-purple-700 bg-purple-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Fechado':
      return 'text-green-700 bg-green-100';
    case 'Em Negociação':
      return 'text-purple-700 bg-purple-100';
    case 'Cancelado':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};