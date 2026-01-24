import { useEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import mapboxgl, { Map } from "mapbox-gl";

// Golden Gate Bridge coordinates
const GOLDEN_GATE_START: [number, number] = [-122.4785, 37.8099]; // South side (SF)
const GOLDEN_GATE_END: [number, number] = [-122.4775, 37.8319]; // North side (Marin)

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

export const GoldenGateFlyover = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { delayRender, continueRender } = useDelayRender();

  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  // Animation duration in seconds
  const flyoverDuration = 8;
  const totalFrames = flyoverDuration * fps;

  // Initial setup
  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 15,
      center: GOLDEN_GATE_START,
      pitch: 60,
      bearing: 0,
      style: "mapbox://styles/mapbox/standard",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("style.load", () => {
      // Hide labels but keep 3D objects for the bridge
      const hideFeatures = [
        "showRoadsAndTransit",
        "showRoads",
        "showTransit",
        "showPedestrianRoads",
        "showRoadLabels",
        "showTransitLabels",
        "showPlaceLabels",
        "showPointOfInterestLabels",
        "showPointsOfInterest",
        "showAdminBoundaries",
        "showLandmarkIcons",
        "showLandmarkIconLabels",
      ];
      for (const feature of hideFeatures) {
        _map.setConfigProperty("basemap", feature, false);
      }

      // Enable 3D for the bridge
      _map.setConfigProperty("basemap", "show3dObjects", true);
      _map.setConfigProperty("basemap", "show3dLandmarks", true);
      _map.setConfigProperty("basemap", "show3dBuildings", true);

      // Hide all road/street colors
      _map.setConfigProperty("basemap", "colorMotorways", "rgba(0,0,0,0)");
      _map.setConfigProperty("basemap", "colorRoads", "rgba(0,0,0,0)");
      _map.setConfigProperty("basemap", "colorTrunks", "rgba(0,0,0,0)");
      _map.setConfigProperty("basemap", "colorStreets", "rgba(0,0,0,0)");
      _map.setConfigProperty("basemap", "colorStreetsMinor", "rgba(0,0,0,0)");
      _map.setConfigProperty("basemap", "colorPrimary", "rgba(0,0,0,0)");
      _map.setConfigProperty("basemap", "colorSecondary", "rgba(0,0,0,0)");
      _map.setConfigProperty("basemap", "colorTertiary", "rgba(0,0,0,0)");
    });

    _map.on("load", () => {
      continueRender(handle);
      setMap(_map);
    });
  }, [handle, continueRender]);

  // Animate camera flyover
  useEffect(() => {
    if (!map) return;

    const animationHandle = delayRender("Animating flyover...");

    // Progress from 0 to 1 over the duration
    const progress = interpolate(frame, [0, totalFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });

    // Camera path: fly from south to north over the bridge
    const centerLng = interpolate(
      progress,
      [0, 1],
      [GOLDEN_GATE_START[0], GOLDEN_GATE_END[0]]
    );
    const centerLat = interpolate(
      progress,
      [0, 1],
      [GOLDEN_GATE_START[1], GOLDEN_GATE_END[1]]
    );

    // Zoom: start closer, pull back mid-flight, then get closer again
    const zoom = interpolate(progress, [0, 0.3, 0.7, 1], [15.5, 14.5, 14.5, 15.5]);

    // Pitch: maintain dramatic angle throughout
    const pitch = interpolate(progress, [0, 0.5, 1], [65, 70, 60]);

    // Bearing: rotate camera as we fly over
    const bearing = interpolate(progress, [0, 1], [-20, 40]);

    // Set camera position
    map.setCenter([centerLng, centerLat]);
    map.setZoom(zoom);
    map.setPitch(pitch);
    map.setBearing(bearing);

    map.once("idle", () => continueRender(animationHandle));
  }, [frame, map, totalFrames, delayRender, continueRender]);

  const style: React.CSSProperties = useMemo(
    () => ({ width, height, position: "absolute" }),
    [width, height]
  );

  return <AbsoluteFill ref={ref} style={style} />;
};
