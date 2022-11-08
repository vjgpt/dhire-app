import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { usePersistanceStore } from 'src/app/store/persistance/persistanceStore';
import { useProfileStore } from 'src/app/store/profile/profileStore';
//import getUserByWallet from '../getUserByWallet';
import {
  IRecruiterProfile,
  IUserProfile,
} from '@/interfaces/store/data/userProfile.interface';
import axios from 'axios';
import { roleEnum } from 'src/lib/enums/enums';

/** checks if wallet is connected or if the user is present in the local storage and then fetches user data*/
export const useWalletConnection = (isOpen: boolean, onOpen: () => void) => {
  const wallet = useWallet();
  const router = useRouter();

  const {
    user,
    updateWallet,
    updateUser,
    updateUserProfile,
    updateRecruiterProfile,
  } = useProfileStore();
  const {
    removePersistanceUser,
    setPersistanceUser,
    user: persistenceUser,
  } = usePersistanceStore();
  // check if the wallet is connected or not before the app starts
  useEffect(() => {
    console.log(
      'useEffect called inside useWalletConnection HOOK - ',
      wallet.connected
    );
    if (!wallet.connected) {
      // the screen refreshes due to this it takes time for wallet to throw wallet.connected = true
      console.log('wallet not connected');
      removePersistanceUser();
      //  removeUser();
      updateWallet({
        connected: false,
        loading: false,
      });
      router.push('/');
      return;
    } else {
      updateWallet({
        connected: true,
        loading: false,
        walletId: wallet.publicKey?.toBase58(),
        walletName: 'find the wallet name',
      });
      console.log('wallet connected');
      axios
        .get(`/api/user/${wallet.publicKey?.toBase58()}`)
        .then((res) => {
          if (!res.data) return onOpen();
          let url =
            res.data.type === roleEnum.RECRUIT
              ? '/api/userProfile/'
              : '/api/recruiterProfile/';
          axios
            .get(url + res.data.id)
            .then((userProfileResponse) => {
              console.log('user profile response - ', userProfileResponse);
              updateUser(res.data);
              setPersistanceUser(res.data);
              if (res.data.type === roleEnum.RECRUIT) {
                const userProfile = userProfileResponse.data as IUserProfile;
                updateUserProfile(userProfile);
                router.push('/profile/' + res.data.id);
                return userProfile as IUserProfile;
              } else {
                const userProfile =
                  userProfileResponse.data as IRecruiterProfile;
                updateRecruiterProfile(userProfile);
                router.push('/recruiter/' + res.data.id);
                return userProfile as IRecruiterProfile;
              }
            })
            .catch((e) => {
              console.log('1. error - ', e);
            });
        })
        .catch(() => {
          onOpen();
        });
    }
  }, [wallet.connected]);

  return user;
};