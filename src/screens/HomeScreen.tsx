import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../app/navigation/types';
import ProjectDashboardList from '../components/home/ProjectDashboardList';
import NamePromptModal from '../components/home/NamePromptModal';
import VideoPickerModal from '../components/home/VideoPickerModal';
import BlurHeader from '../components/home/BlurHeader';
import type { VideoItem } from '../store/useLibraryStore';
import { useProjectStore } from '../store/useProjectStore';
import type { Project } from '../store/useProjectStore';
import { pickCustomProjectPreview } from '../services/projectPreview';
import {
  spacing,
  typography,
  useThemedStyles,
  type AppTheme,
} from '../theme';
import { useTranslation, interpolate } from '../i18n/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface PromptState {
  visible: boolean;
  mode: 'create-folder' | 'rename-folder' | 'rename-project';
  targetId: string | null;
  title: string;
  description: string;
  initialValue: string;
  confirmLabel: string;
}

const INITIAL_PROMPT_STATE: PromptState = {
  visible: false,
  mode: 'create-folder',
  targetId: null,
  title: '',
  description: '',
  initialValue: '',
  confirmLabel: 'Save',
};

function sanitizeName(value: string): string {
  return value.trim();
}

export default function HomeScreen({ navigation }: Props): React.JSX.Element {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const folders = useProjectStore((state) => state.folders);
  const projects = useProjectStore((state) => state.projects);
  const trashActivated = useProjectStore((state) => state.trashActivated);
  const createProject = useProjectStore((state) => state.createProject);
  const createFolder = useProjectStore((state) => state.createFolder);
  const renameFolder = useProjectStore((state) => state.renameFolder);
  const removeFolder = useProjectStore((state) => state.removeFolder);
  const renameProject = useProjectStore((state) => state.renameProject);
  const duplicateProject = useProjectStore((state) => state.duplicateProject);
  const moveProjectToFolder = useProjectStore((state) => state.moveProjectToFolder);
  const removeProject = useProjectStore((state) => state.removeProject);
  const recoverProject = useProjectStore((state) => state.recoverProject);
  const removeProjectPermanently = useProjectStore((state) => state.removeProjectPermanently);
  const setCustomProjectPreview = useProjectStore((state) => state.setCustomProjectPreview);
  const cleanTrash = useProjectStore((state) => state.cleanTrash);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [promptState, setPromptState] = useState<PromptState>(INITIAL_PROMPT_STATE);

  const projectIndex = useMemo(
    () =>
      projects.reduce<Record<string, Project>>((accumulator, project) => {
        accumulator[project.id] = project;
        return accumulator;
      }, {}),
    [projects],
  );

  const closePrompt = useCallback(() => {
    setPromptState(INITIAL_PROMPT_STATE);
  }, []);

  const handleOpenFolderPrompt = useCallback((folderId?: string) => {
    const folder = folderId ? folders.find((item) => item.id === folderId) : undefined;
    setPromptState({
      visible: true,
      mode: folder ? 'rename-folder' : 'create-folder',
      targetId: folder?.id ?? null,
      title: folder ? t.renameFolderTitle : t.newFolderTitle,
      description: folder ? t.renameFolderDesc : t.newFolderDesc,
      initialValue: folder?.name ?? t.newFolderDefault,
      confirmLabel: folder ? t.renameLabel : t.createLabel,
    });
  }, [folders, t]);

  const handleOpenProjectRenamePrompt = useCallback((project: Project) => {
    setPromptState({
      visible: true,
      mode: 'rename-project',
      targetId: project.id,
      title: t.renameProjectTitle,
      description: t.renameProjectDesc,
      initialValue: project.name,
      confirmLabel: t.renameLabel,
    });
  }, [t]);

  const handleConfirmPrompt = useCallback(
    (rawValue: string) => {
      const nextName = sanitizeName(rawValue);
      if (!nextName) {
        Alert.alert(t.nameRequired, t.nameRequiredBody);
        return;
      }

      if (promptState.mode === 'create-folder') {
        createFolder(nextName);
      } else if (promptState.mode === 'rename-folder' && promptState.targetId) {
        renameFolder(promptState.targetId, nextName);
      } else if (promptState.mode === 'rename-project' && promptState.targetId) {
        renameProject(promptState.targetId, nextName);
      }

      closePrompt();
    },
    [
      closePrompt,
      createFolder,
      promptState.mode,
      promptState.targetId,
      renameFolder,
      renameProject,
    ],
  );

  const handleCreateProject = useCallback(() => {
    setPickerVisible(true);
  }, []);

  const handleSelectVideo = useCallback(
    (video: VideoItem) => {
      const project = createProject({
        sourceVideoUri: video.uri,
        duration: video.duration,
        filename: video.filename,
      });

      setPickerVisible(false);
      navigation.navigate('Editor', { projectId: project.id });
    },
    [createProject, navigation],
  );

  const handleProjectPress = useCallback(
    (projectId: string) => {
      const project = projectIndex[projectId];
      if (!project || project.status === 'trash') {
        return;
      }

      navigation.navigate('Editor', { projectId });
    },
    [navigation, projectIndex],
  );

  const handleProjectAction = useCallback(
    async (
      project: Project,
      action:
        | 'rename'
        | 'duplicate'
        | 'remove'
        | 'recover'
        | 'remove-permanently'
        | 'custom-preview'
        | { type: 'move'; folderId: string },
    ) => {
      if (typeof action === 'object' && action.type === 'move') {
        moveProjectToFolder(project.id, action.folderId);
        return;
      }

      switch (action) {
        case 'rename':
          handleOpenProjectRenamePrompt(project);
          break;
        case 'duplicate':
          duplicateProject(project.id);
          break;
        case 'custom-preview': {
          try {
            const previewUri = await pickCustomProjectPreview(project.id);
            if (previewUri) {
              setCustomProjectPreview(project.id, previewUri);
            }
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : t.customPreviewUnavailableBody;
            Alert.alert(t.customPreviewUnavailableTitle, message);
          }
          break;
        }
        case 'remove':
          removeProject(project.id);
          break;
        case 'recover':
          recoverProject(project.id);
          break;
        case 'remove-permanently':
          Alert.alert(
            t.removePermanentlyTitle,
            interpolate(t.removePermanentlyBody, { name: project.name }),
            [
              { text: t.cancel, style: 'cancel' },
              {
                text: t.remove,
                style: 'destructive',
                onPress: () => removeProjectPermanently(project.id),
              },
            ],
          );
          break;
      }
    },
    [
      duplicateProject,
      handleOpenProjectRenamePrompt,
      moveProjectToFolder,
      recoverProject,
      removeProject,
      removeProjectPermanently,
      setCustomProjectPreview,
    ],
  );

  const handleFolderAction = useCallback(
    (
      section: {
        id: string;
        title: string;
        kind: 'all' | 'folder' | 'trash';
      },
      action: 'rename' | 'remove' | 'clean-trash',
    ) => {
      if (action === 'rename') {
        handleOpenFolderPrompt(section.id);
        return;
      }

      if (action === 'remove') {
        removeFolder(section.id);
        return;
      }

      Alert.alert(
        t.cleanTrashTitle,
        t.cleanTrashBody,
        [
          { text: t.cancel, style: 'cancel' },
          {
            text: t.cleanTrash,
            style: 'destructive',
            onPress: () => cleanTrash(),
          },
        ],
      );
    },
    [cleanTrash, handleOpenFolderPrompt, removeFolder],
  );

  return (
    <View style={styles.root}>
      <ProjectDashboardList
        folders={folders}
        projects={projects}
        trashActivated={trashActivated}
        onProjectPress={handleProjectPress}
        onCreateProject={handleCreateProject}
        onProjectAction={handleProjectAction}
        onFolderAction={handleFolderAction}
      />
      <BlurHeader onCreateFolderPress={handleOpenFolderPrompt} />

      {projects.length === 0 && folders.length === 0 ? (
        <View style={styles.emptyOverlay} pointerEvents="none">
          <Text style={styles.emptyTitle}>{t.startFirstProject}</Text>
          <Text style={styles.emptyBody}>{t.startFirstProjectBody}</Text>
        </View>
      ) : null}

      <VideoPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelectVideo={handleSelectVideo}
      />

      <NamePromptModal
        visible={promptState.visible}
        title={promptState.title}
        description={promptState.description}
        initialValue={promptState.initialValue}
        confirmLabel={promptState.confirmLabel}
        onCancel={closePrompt}
        onConfirm={handleConfirmPrompt}
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) => {
  const colors = theme.colors;

  return {
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    emptyOverlay: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      top: 132,
      padding: spacing.lg,
      borderRadius: 20,
      backgroundColor: colors.overlay,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    emptyBody: {
      ...typography.body,
      color: colors.textSecondary,
    },
  };
};
