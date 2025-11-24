import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  Heart,
  Calendar,
  Map,
  Search,
  LogOut,
  Bell,
  Star,
  ChevronRight,
  LayoutDashboard,
  User
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  institutionId: string;
  institutionName: string;
  location: string;
  image?: string;
  rating: number;
  reviewCount?: number;
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, accessToken } = useContext(AuthContext);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏥' },
    { id: 'Odontologia', name: 'Odontologia', icon: '🦷' },
    { id: 'Cardiologia', name: 'Cardiologia', icon: '❤️' },
    { id: 'Ortopedia', name: 'Ortopedia', icon: '🦴' },
    { id: 'Pediatria', name: 'Pediatria', icon: '👶' },
    { id: 'Psicologia', name: 'Psicologia', icon: '🧠' },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory]);

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4ede0739/services`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Add sample data if no services exist
        if (data.services.length === 0) {
          await createSampleServices();
          fetchServices();
          return;
        }
        
        setServices(data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleServices = async () => {
    const sampleServices = [
      {
        name: 'Consulta Odontológica',
        category: 'Odontologia',
        description: 'Atendimento odontológico completo com profissionais qualificados',
        institutionId: 'sample-1',
        institutionName: 'UBS Central',
        location: 'Rua das Flores, 123 - Centro',
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGluaWN8ZW58MXx8fHwxNzYzOTg3NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rating: 4.8,
        reviewCount: 124,
      },
      {
        name: 'Cardiologia Geral',
        category: 'Cardiologia',
        description: 'Avaliação cardiológica e acompanhamento de doenças cardiovasculares',
        institutionId: 'sample-2',
        institutionName: 'Hospital Municipal',
        location: 'Av. Principal, 456 - Jardim',
        image: 'https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFydCUyMGNhcmRpb2xvZ3l8ZW58MXx8fHwxNzYzOTg3NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rating: 4.9,
        reviewCount: 89,
      },
      {
        name: 'Ortopedia',
        category: 'Ortopedia',
        description: 'Tratamento de problemas ósseos e musculares',
        institutionId: 'sample-3',
        institutionName: 'Clínica São José',
        location: 'Rua dos Médicos, 789 - Vila Nova',
        image: 'https://images.unsplash.com/photo-1516574290314-5a56c5acdd4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoJTIwY2xpbmljfGVufDF8fHx8MTc2Mzk3Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rating: 4.7,
        reviewCount: 67,
      },
      {
        name: 'Pediatria',
        category: 'Pediatria',
        description: 'Atendimento infantil com pediatras especializados',
        institutionId: 'sample-1',
        institutionName: 'UBS Central',
        location: 'Rua das Flores, 123 - Centro',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzYzOTUyNjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rating: 4.9,
        reviewCount: 156,
      },
    ];

    for (const service of sampleServices) {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4ede0739/services`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(service),
        }
      );
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">ServiçoFácil</h1>
                <p className="text-sm text-gray-500">Olá, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotifications(0)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/appointments')}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all text-center"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Agendamentos</span>
            </button>

            <button
              onClick={() => navigate('/favorites')}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all text-center"
            >
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Favoritos</span>
            </button>

            <button
              onClick={() => navigate('/map')}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all text-center"
            >
              <Map className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Mapa</span>
            </button>

            {user?.type === 'institution' && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all text-center"
              >
                <LayoutDashboard className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">Painel Admin</span>
              </button>
            )}

            {user?.type === 'client' && (
              <button className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all text-center">
                <User className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">Perfil</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="container mx-auto px-4 -mt-6 relative z-5">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar serviços..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl mb-4 text-gray-900">
          Serviços Disponíveis
        </h2>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Nenhum serviço encontrado</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/service/${service.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {service.image ? (
                    <ImageWithFallback
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Heart className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm">
                    {service.category}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl mb-2 text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      <span className="text-sm">{service.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({service.reviewCount || 0} avaliações)
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 mb-3">
                    📍 {service.institutionName}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-indigo-600">Ver detalhes</span>
                    <ChevronRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
