import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Field } from "@/src/components/ui/Field";
import { Badge } from "@/src/components/ui/Badge";
import { Colors } from "@/src/constants/Colors";

type Mode = "bluetooth" | "wifi";

type Device = { id: string; name: string; detail: string };

// Demo devices a scan might surface. Real Bluetooth (react-native-ble-plx) and
// Wi-Fi pairing need a dev build + native permissions — flagged below.
const NEARBY: Device[] = [
  { id: "ss-100", name: "Soil Sensor SS-100", detail: "Moisture · Temp · pH" },
  { id: "ws-2", name: "Weather Station WS-2", detail: "Rain · Wind · Humidity" },
  { id: "iv-9", name: "Irrigation Valve IV-9", detail: "Smart water control" },
];

export default function IotConnectScreen() {
  const [mode, setMode] = useState<Mode>("bluetooth");
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState<Device[]>([]);
  const [connected, setConnected] = useState<Device[]>([]);
  const [wifiHost, setWifiHost] = useState("");

  const scan = () => {
    setFound([]);
    setScanning(true);
    setTimeout(() => {
      setFound(NEARBY);
      setScanning(false);
    }, 1500);
  };

  const connect = (device: Device) => {
    if (connected.some((d) => d.id === device.id)) return;
    setConnected((prev) => [...prev, device]);
    Alert.alert("Device connected", `${device.name} is paired. Live telemetry is coming soon.`);
  };

  const connectWifi = () => {
    const host = wifiHost.trim();
    if (!host) return;
    connect({ id: `wifi-${host}`, name: `Wi-Fi device (${host})`, detail: "Local network" });
    setWifiHost("");
  };

  return (
    <Screen>
      <PageHeader title="Connect Devices" subtitle="Link your sensors and controllers" />

      {/* Mode toggle */}
      <View className="flex-row gap-2">
        <ModeChip label="📶  Bluetooth" active={mode === "bluetooth"} onPress={() => setMode("bluetooth")} />
        <ModeChip label="🛜  Wi-Fi" active={mode === "wifi"} onPress={() => setMode("wifi")} />
      </View>

      {mode === "bluetooth" ? (
        <Card>
          <Text className="card__title">Bluetooth pairing</Text>
          <Text className="card__subtitle">Scan for nearby AgroVision-compatible devices.</Text>
          <View className="mt-4">
            <Button label={scanning ? "Scanning…" : "Scan for devices"} onPress={scan} loading={scanning} />
          </View>

          {found.length > 0 ? (
            <View className="gap-3 mt-4">
              {found.map((d) => {
                const isOn = connected.some((c) => c.id === d.id);
                return (
                  <View key={d.id} className="flex-row items-center gap-3 bg-surfaceAlt rounded-2xl p-3">
                    <Text className="text-2xl">📡</Text>
                    <View className="flex-1">
                      <Text className="text-ink text-sm font-bold">{d.name}</Text>
                      <Text className="text-muted text-xs mt-0.5">{d.detail}</Text>
                    </View>
                    {isOn ? (
                      <Badge label="Connected" tone="success" />
                    ) : (
                      <TouchableOpacity className="chip chip--active" activeOpacity={0.8} onPress={() => connect(d)}>
                        <Text className="chip__label chip__label--active">Connect</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          ) : scanning ? (
            <View className="items-center mt-4">
              <ActivityIndicator color={Colors.brand} />
            </View>
          ) : null}
        </Card>
      ) : (
        <Card>
          <Text className="card__title">Wi-Fi pairing</Text>
          <Text className="card__subtitle">Enter the device's IP address or hostname on your network.</Text>
          <View className="mt-4 gap-3">
            <Field placeholder="e.g. 192.168.1.50" value={wifiHost} onChangeText={setWifiHost} autoCapitalize="none" keyboardType="numbers-and-punctuation" />
            <Button label="Connect over Wi-Fi" onPress={connectWifi} />
          </View>
        </Card>
      )}

      {/* Connected devices */}
      <Text className="section__title">Connected devices</Text>
      {connected.length === 0 ? (
        <Card>
          <Text className="text-muted text-sm">No devices connected yet.</Text>
        </Card>
      ) : (
        <View className="gap-3">
          {connected.map((d) => (
            <View key={d.id} className="list-row">
              <View className="w-3 h-3 rounded-full" style={{ backgroundColor: Colors.brand }} />
              <View className="flex-1">
                <Text className="list-row__title">{d.name}</Text>
                <Text className="list-row__meta">{d.detail}</Text>
              </View>
              <Badge label="Online" tone="success" />
            </View>
          ))}
        </View>
      )}

      <Card variant="accent">
        <Text className="card__title">📈 Live telemetry coming soon</Text>
        <Text className="card__subtitle">
          Real Bluetooth (react-native-ble-plx) and Wi-Fi device control need a custom dev build with
          native permissions. This screen shows the pairing flow; live sensor charts land next.
        </Text>
      </Card>
    </Screen>
  );
}

function ModeChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity className={`chip flex-1 items-center ${active ? "chip--active" : ""}`} activeOpacity={0.8} onPress={onPress}>
      <Text className={`chip__label ${active ? "chip__label--active" : ""}`}>{label}</Text>
    </TouchableOpacity>
  );
}
