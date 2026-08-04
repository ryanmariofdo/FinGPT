import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const FinanceDetails = () => {
  const id = useLocalSearchParams<{ id: string }>().id;

  return (
    <View>
      <Text>Finances: {id}</Text>
      <Link href="/">Go back</Link>
    </View>
  );
};

export default FinanceDetails;
