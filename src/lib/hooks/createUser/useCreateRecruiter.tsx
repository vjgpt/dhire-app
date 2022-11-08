import { IUser } from '@/interfaces/store/data/user.interface';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { usePersistanceStore } from 'src/app/store/persistance/persistanceStore';
import { useProfileStore } from 'src/app/store/profile/profileStore';
import { roleEnum } from 'src/lib/enums/enums';
import { IRecruiterProfile } from '@/interfaces/store/data/userProfile.interface';

// ERROR HANDLING NOT DONE

export const useCreateRecruiterAccount = (onClose: any) => {
  console.log('2 - use create recruiter hook called');
  const connected_wallet = useWallet();
  const { createNewUser, createNewRecruiterProfile } = useProfileStore();
  const { setPersistanceUser } = usePersistanceStore();
  const router = useRouter();

  async function submit(submittedData: any) {
    if (!connected_wallet.publicKey?.toBase58()) return;
    console.log('on submit function called - ', submittedData);
    const Data: IUser = {
      name: submittedData.name,
      username: submittedData.userName,
      wallet: {
        walletId: connected_wallet.publicKey.toBase58(),
        walletName: 'find the wallet name',
        connected: true,
        loading: false,
      },
      type: roleEnum.RECRUITER,
    };

    const createdUserStoreResponse = (await createNewUser(Data)) as {
      data: IUser;
      success: boolean;
      message: string;
    };

    const createdNewUserProfile = (await createNewRecruiterProfile({
      userId: createdUserStoreResponse.data.id,
      image: submittedData.image,
      company: submittedData.company,
      website: submittedData.website,
      location: submittedData.location,
    })) as {
      data: IRecruiterProfile;
      success: boolean;
      message: string;
    };

    console.log(
      'created user response from store - ',
      createdUserStoreResponse.message,
      createdNewUserProfile.message
    );

    if (!createdUserStoreResponse.success)
      return console.log('created user response from store was unsuccessful');

    setPersistanceUser(createdUserStoreResponse.data);
    let user = createdUserStoreResponse.data;
    router.push('/recruiter/' + user.id);
    onClose();
  }
  return submit;
};
