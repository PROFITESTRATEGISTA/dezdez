import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileService, UserProfileData } from '../../services/profileService';

interface ClientProfileProps {
  user: any;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ user }) => {
  const { session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfileData>({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Carregar dados do perfil do usuário
  useEffect(() => {
    // Inicializar com dados do usuário mockado
    setEditedUser({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      cpf: user?.personalData?.cpf || '',
      address: {
        street: user?.personalData?.address?.street || '',
        number: user?.personalData?.address?.number || '',
        complement: user?.personalData?.address?.complement || '',
        neighborhood: user?.personalData?.address?.neighborhood || '',
        city: user?.personalData?.address?.city || '',
        state: user?.personalData?.address?.state || '',
        zipCode: user?.personalData?.address?.zipCode || ''
      },
      emergencyContact: {
        name: user?.personalData?.emergencyContact?.name || '',
        phone: user?.personalData?.emergencyContact?.phone || '',
        relationship: user?.personalData?.emergencyContact?.relationship || ''
      }
    });
    
    // Tentar carregar dados salvos do localStorage
    const loadSavedProfile = async () => {
      const savedProfile = await ProfileService.loadProfileMock();
      if (savedProfile) {
        setEditedUser(savedProfile);
      }
    };
    
    loadSavedProfile();
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Usar método mock para salvar perfil
      const success = await ProfileService.saveProfileMock(editedUser);
      
      if (success) {
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Erro ao salvar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setSaveError('Ocorreu um erro ao salvar o perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 lg:hidden">Meu Perfil</h1>
      
      {/* Informações Pessoais */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Dados Pessoais
            {!isEditing && (
              <span className="ml-2 text-xs text-blue-600">(Clique em Editar para atualizar seus dados)</span>
            )}
          </h3>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="text-green-600 hover:text-green-800 flex items-center space-x-1 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full mr-1"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-red-600 hover:text-red-800 flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </button>
          )}
        </div>
        
        
        {saveError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {saveError}
          </div>
        )}
        
        {saveSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Perfil atualizado com sucesso!
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.fullName}
                onChange={(e) => setEditedUser({...editedUser, fullName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.fullName || 'Não informado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">CPF</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.cpf}
                onChange={(e) => setEditedUser({...editedUser, cpf: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.cpf || 'Não informado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.email || 'Não informado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Telefone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.phone}
                onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.phone || 'Não informado'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-green-600" />
          Endereço
          {isEditing && (
            <span className="ml-2 text-sm text-blue-600">(Editável)</span>
          )}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500">Rua</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.address.street}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  address: {...editedUser.address, street: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.address.street || 'Não informado'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Número</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.address.number}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  address: {...editedUser.address, number: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.address.number || 'Não informado'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Complemento</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.address.complement || ''}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  address: {...editedUser.address, complement: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.address.complement || 'Não informado'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Bairro</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.address.neighborhood}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  address: {...editedUser.address, neighborhood: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.address.neighborhood || 'Não informado'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Cidade</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.address.city}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  address: {...editedUser.address, city: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.address.city || 'Não informado'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Estado</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.address.state}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  address: {...editedUser.address, state: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.address.state || 'Não informado'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">CEP</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.address.zipCode}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  address: {...editedUser.address, zipCode: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.address.zipCode || 'Não informado'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contato de Emergência */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2 text-red-600" />
          Contato de Emergência
          {isEditing && (
            <span className="ml-2 text-sm text-blue-600">(Editável)</span>
          )}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Nome</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.emergencyContact.name}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  emergencyContact: {...editedUser.emergencyContact, name: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.emergencyContact.name || 'Não informado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Telefone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.emergencyContact.phone}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  emergencyContact: {...editedUser.emergencyContact, phone: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.emergencyContact.phone || 'Não informado'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Parentesco</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.emergencyContact.relationship}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  emergencyContact: {...editedUser.emergencyContact, relationship: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{editedUser.emergencyContact.relationship || 'Não informado'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;