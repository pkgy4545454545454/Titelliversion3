import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, UserPlus, MapPin, Users, Mail, Phone } from 'lucide-react';
// ↑ ajoute les icônes que tu utilises
// import { adminAPI } from '../services/api'; // si pas utilisé, enlève
import { useCart } from '../context/CartContext';
import { adminAPI } from '../services/api';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;
const DemandeInscription = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [registrationRequests, setRegistrationRequests] = useState([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { type: 'registrationRequests' };

    
         setRegistrationLoading(true);
         const response = await adminAPI.list(params);
        setRegistrationRequests(response.data.items);
         setTotal(response.data.total);
        setRegistrationLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = (item) => {
    // const enterprise = enterprises[item.enterprise_id];
    // addItem(item, enterprise);
  };
 const fetchRegistrationRequests = async () => {
    try {
      setRegistrationLoading(true);
      const response = await axios.get(`${API_URL}/admin/registration-requests`, { 
        params: { status: 'pending' },
        headers: { Authorization: `Bearer ${localStorage.getItem('titelli_token')}` }
      });
      setRegistrationRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching registration requests:', error);
    } finally {
      setRegistrationLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrationRequests();
  }, []);


  return (
    <div className="min-h-screen bg-[#050505] pt-24">
      {/* HERO */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source
              src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/video_produits_v2.mp4`}
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/50 to-[#050505]" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <h1 className="text-5xl font-bold text-white mb-4">Produits</h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Trouvez les meilleurs produits de la région de Lausanne
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* FILTER BAR */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{total} résultats</span>

            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* LIST */}
        {registrationLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : registrationRequests.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">Aucune demande d'inscription en attente</p>
          </div>
        ) : (
          <div className="space-y-4 py-8">
            {registrationRequests.map((request) => (
              <div
                key={request.id || request._id}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Enterprise Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={
                        request.enterprise?.image ||
                        `https://ui-avatars.com/api/?name=${request.enterprise_name}&background=0047AB&color=fff`
                      }
                      alt={request.enterprise_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-white font-semibold text-lg">{request.enterprise_name}</h3>
                      <p className="text-[#D4AF37] text-sm">{request.enterprise?.category}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {request.enterprise?.address}
                      </p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Informations du demandeur</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        {request.user_info?.first_name} {request.user_info?.last_name}
                      </p>
                      <p className="text-gray-300 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {request.user_info?.email}
                      </p>
                      <p className="text-gray-300 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {request.user_info?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="flex-1 bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Documents fournis</h4>
                    <div className="space-y-2 text-sm">

                      <p className="text-gray-300">
                        <span className="text-gray-500">Registre du commerce:</span>{' '}
                        <span className="text-[#D4AF37] font-mono">{request.commerce_register_id}</span>
                      </p>

                      <p className="text-gray-300">
                        <span className="text-gray-500">Manager référent:</span>{' '}
                        {request.manager_id}
                      </p>

                      <p className="text-gray-300">
                        <span className="text-gray-500">Pièce d'identité:</span>{' '}
                        {request.identity_document ? (
                          <img
                              src={`${API_URL}/api/uploads/${request.identity_document}`}
                              alt="ID Document"
                              className="w-32 h-auto mt-2 rounded-md object-cover"
                            />
                            ) : (
                        <span className="text-yellow-400">Non fournie</span>
                        )}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Demande reçue le{' '}
                        {request.created_at
                          ? new Date(request.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CATEGORIES (si tu veux remettre plus bas) */}
      </div>
    </div>
  );
};

export default DemandeInscription;

