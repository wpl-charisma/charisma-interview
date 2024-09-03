import { Button, Text, View } from 'react-native';

// import { trpc } from '@/state/trpc';
import { supabase } from '@/state/supabase';
import { FC } from 'react';

const PageHome: FC = () => {
  return (
    <View>
      <Text>Home page!</Text>
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
};

export default PageHome;
