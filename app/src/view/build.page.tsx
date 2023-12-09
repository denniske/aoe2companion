import React from "react";
import { buildsData } from "../../../data/src/data/builds";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "app/App2";
import { BuildListPage, BuildDetail } from "./build-order";
import { getTranslation } from "../helper/translate";
import TextHeader from "./components/navigation-header/text-header";
import { getBuildById } from "../../../data/src/helper/builds";
import { genericCivIcon, getCivIconLocal } from "../helper/civs";
import IconHeader from "./components/navigation-header/icon-header";
import { useFavoritedBuild } from "../service/storage";
import { TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export function BuildMenu(props: any) {
  const { toggleFavorite, isFavorited } = useFavoritedBuild(
    props.route.params.build
  );

  return (
    <TouchableOpacity
      hitSlop={10}
      onPress={toggleFavorite}
      style={{ paddingRight: 12 }}
    >
      <FontAwesome5
        solid={isFavorited}
        name="heart"
        size={20}
        color="#ef4444"
      />
    </TouchableOpacity>
  );
}

export function BuildTitle(props: any) {
  const build = getBuildById(props.route?.params?.build);

  if (build) {
    return (
      <IconHeader
        icon={getCivIconLocal(build.civilization) ?? genericCivIcon}
        text={build.civilization}
        subtitle={build.title.replace(build.civilization, "")}
        onLayout={props.titleProps.onLayout}
      />
    );
  }
  return (
    <TextHeader
      text={getTranslation("builds.title")}
      onLayout={props.titleProps.onLayout}
    />
  );
}

const BuildPage = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Guide">>();
  const build = buildsData.find((build) => build.id === route.params?.build);

  if (build) {
    return <BuildDetail {...build} />;
  }

  return <BuildListPage />;
};

export default BuildPage;
