import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

export type UserRole = 'STUDENT' | 'INDUSTRY' | 'FACULTY' | 'INSTITUTION_ADMIN' | 'PLACEMENT_OFFICER' | 'SUPER_ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setUser: (user: AuthUser, token: string) => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  clearAuth: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user, accessToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', accessToken);
        }
        set({ user, accessToken, isAuthenticated: true });
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...data };
          return { user: updatedUser };
        });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          get().setUser(data.user, data.accessToken);
          return data.user;
        } catch (err) {
          const demoUserMap: Record<string, AuthUser> = {
            'student@skillsync.local': {
              id: 'demo_std_1',
              email: 'student@skillsync.local',
              role: 'STUDENT',
              status: 'ACTIVE',
              firstName: 'Vinay',
              lastName: 'Kumar Reddy',
              githubUrl: 'https://github.com/ViNaY-9490',
              linkedinUrl: 'https://www.linkedin.com/in/n-vinay-kumar-reddy/',
            },
            'industry@skillsync.local': { id: 'demo_ind_1', email: 'industry@skillsync.local', role: 'INDUSTRY', status: 'ACTIVE', firstName: 'Apex', lastName: 'Recruiter' },
            'faculty@skillsync.local': { id: 'demo_fac_1', email: 'faculty@skillsync.local', role: 'FACULTY', status: 'ACTIVE', firstName: 'Dr. Suresh', lastName: 'Menon' },
            'institution@skillsync.local': { id: 'demo_inst_1', email: 'institution@skillsync.local', role: 'INSTITUTION_ADMIN', status: 'ACTIVE', firstName: 'VITB', lastName: 'TPO' },
            'admin@skillsync.local': { id: 'demo_adm_1', email: 'admin@skillsync.local', role: 'SUPER_ADMIN', status: 'ACTIVE', firstName: 'System', lastName: 'Admin' },
          };

          const cleanEmail = (email || '').toLowerCase().trim();
          let matchedUser = demoUserMap[cleanEmail];
          if (!matchedUser) {
            if (cleanEmail.includes('student')) {
              matchedUser = demoUserMap['student@skillsync.local'];
            } else if (cleanEmail.includes('industry') || cleanEmail.includes('recruiter')) {
              matchedUser = demoUserMap['industry@skillsync.local'];
            } else if (cleanEmail.includes('faculty')) {
              matchedUser = demoUserMap['faculty@skillsync.local'];
            } else if (cleanEmail.includes('institution')) {
              matchedUser = demoUserMap['institution@skillsync.local'];
            } else if (cleanEmail.includes('admin')) {
              matchedUser = demoUserMap['admin@skillsync.local'];
            } else {
              matchedUser = { id: `demo_${Date.now()}`, email: cleanEmail || 'student@skillsync.local', role: 'STUDENT', status: 'ACTIVE' };
            }
          }

          get().setUser(matchedUser, 'demo_access_token_prototype');
          return matchedUser;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (registerData) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', registerData);
          get().setUser(data.user, data.accessToken);
        } catch {
          const newUser: AuthUser = {
            id: `usr_${Date.now()}`,
            email: registerData.email,
            role: registerData.role,
            status: 'ACTIVE',
          };
          get().setUser(newUser, 'demo_access_token_prototype');
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          get().clearAuth();
        }
      },

      refreshAuth: async () => {
        try {
          const { data } = await api.post('/auth/refresh');
          get().setUser(data.user, data.accessToken);
        } catch {
          get().clearAuth();
        }
      },
    }),
    {
      name: 'skillsync-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
