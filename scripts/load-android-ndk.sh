# Exports ANDROID_NDK_HOME for local `eas build --local` android builds. Source it
# before `eas build`:
#
#   source ./scripts/load-android-ndk.sh
#
# Without it eas-cli warns "ANDROID_NDK_HOME environment variable was not
# specified". The version is read from React Native's version catalog, the same
# ndkVersion gradle (and expo's autolinking plugin) uses, so it follows RN
# upgrades. An already exported value wins.

if [ -z "${ANDROID_NDK_HOME:-}" ]; then
  _sdk="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
  _ndk_version=$(grep -E '^ndkVersion *=' node_modules/react-native/gradle/libs.versions.toml 2>/dev/null | sed -E 's/.*"(.*)".*/\1/')
  if [ -n "$_ndk_version" ] && [ -d "$_sdk/ndk/$_ndk_version" ]; then
    export ANDROID_NDK_HOME="$_sdk/ndk/$_ndk_version"
    echo "ANDROID_NDK_HOME=$ANDROID_NDK_HOME"
  else
    echo "⚠️  NDK ${_ndk_version:-?} not found in $_sdk/ndk -- install it via sdkmanager \"ndk;${_ndk_version}\"."
  fi
  unset _sdk _ndk_version
fi
