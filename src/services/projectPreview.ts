import { NativeModules, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { getFilterById, IDENTITY_MATRIX } from '../filters';

const GENERATED_PREVIEW_DIR = `${RNFS.DocumentDirectoryPath}/project-previews`;
const CUSTOM_PREVIEW_DIR = `${RNFS.DocumentDirectoryPath}/project-custom-previews`;

interface NativePreviewModule {
  generatePreview: (
    projectId: string,
    sourceUri: string,
    filterId: string,
    filterMatrixPayload: string,
    filterIntensity: number,
    timeMs: number,
  ) => Promise<string>;
  pickCustomPreview: (projectId: string) => Promise<string | null>;
}

interface GenerateProjectPreviewParams {
  projectId: string;
  sourceVideoUri: string;
  filterId: string;
  filterIntensity: number;
  timeMs: number;
}

const nativePreviewModule: NativePreviewModule | undefined =
  NativeModules.GradoProjectPreview;

function normalizeFileUri(uri: string): string {
  return uri.replace(/^file:\/\//, '');
}

function ensureFileUri(path: string): string {
  return path.startsWith('file://') ? path : `file://${path}`;
}

export function isGeneratedProjectPreview(uri: string | null | undefined): boolean {
  if (!uri) {
    return false;
  }

  return normalizeFileUri(uri).startsWith(GENERATED_PREVIEW_DIR);
}

function isManagedProjectPreview(uri: string | null | undefined): boolean {
  if (!uri) {
    return false;
  }

  const normalizedUri = normalizeFileUri(uri);

  return (
    normalizedUri.startsWith(GENERATED_PREVIEW_DIR) ||
    normalizedUri.startsWith(CUSTOM_PREVIEW_DIR)
  );
}

export async function cleanupProjectPreview(
  uri: string | null | undefined,
): Promise<void> {
  if (!isManagedProjectPreview(uri)) {
    return;
  }

  try {
    const path = normalizeFileUri(uri!);
    const exists = await RNFS.exists(path);
    if (exists) {
      await RNFS.unlink(path);
    }
  } catch {
    // Best-effort cleanup.
  }
}

export async function pickCustomProjectPreview(
  projectId: string,
): Promise<string | null> {
  if (Platform.OS !== 'ios' || !nativePreviewModule?.pickCustomPreview) {
    throw new Error('Custom previews are currently available on iPhone and iPad only.');
  }

  const previewPath = await nativePreviewModule.pickCustomPreview(projectId);
  return previewPath ? ensureFileUri(previewPath) : null;
}

export async function generateProjectPreview({
  projectId,
  sourceVideoUri,
  filterId,
  filterIntensity,
  timeMs,
}: GenerateProjectPreviewParams): Promise<string> {
  if (Platform.OS !== 'ios' || !nativePreviewModule?.generatePreview) {
    return sourceVideoUri;
  }

  const filterMatrixPayload = (
    getFilterById(filterId)?.colorMatrix ?? IDENTITY_MATRIX
  ).join(',');

  try {
    const previewPath = await nativePreviewModule.generatePreview(
      projectId,
      sourceVideoUri,
      filterId,
      filterMatrixPayload,
      filterIntensity,
      timeMs,
    );

    return ensureFileUri(previewPath);
  } catch {
    return sourceVideoUri;
  }
}
