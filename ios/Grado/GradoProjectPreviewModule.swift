import Foundation
import AVFoundation
import PhotosUI
import React
import UIKit

@objc(GradoProjectPreview)
final class GradoProjectPreview: NSObject, PHPickerViewControllerDelegate {
  private var pendingPickerResolve: RCTPromiseResolveBlock?
  private var pendingPickerReject: RCTPromiseRejectBlock?
  private var pendingPickerProjectId: String?

  @objc static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(generatePreview:sourceUri:filterId:filterMatrixPayload:filterIntensity:timeMs:resolve:reject:)
  func generatePreview(
    _ projectId: String,
    sourceUri: String,
    filterId: String,
    filterMatrixPayload: String,
    filterIntensity: NSNumber,
    timeMs: NSNumber,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task.detached(priority: .utility) {
      do {
        let renderer = await MainActor.run {
          GradoFilteredVideoView(frame: .zero)
        }
        let previewPath = try await renderer.generateProjectPreview(
          projectId: projectId,
          sourceUri: sourceUri,
          filterId: filterId,
          filterMatrixPayload: filterMatrixPayload,
          filterIntensity: CGFloat(truncating: filterIntensity),
          timeMs: Double(truncating: timeMs)
        )

        resolve(previewPath)
      } catch {
        reject("preview_generation_failed", error.localizedDescription, error)
      }
    }
  }

  @objc(pickCustomPreview:resolve:reject:)
  func pickCustomPreview(
    _ projectId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task { @MainActor in
      if self.pendingPickerResolve != nil {
        reject(
          "picker_in_progress",
          "Grado is already waiting for a custom preview selection.",
          nil
        )
        return
      }

      guard let presenter = Self.topViewController() else {
        reject(
          "picker_unavailable",
          "Grado could not open the photo picker.",
          nil
        )
        return
      }

      var configuration = PHPickerConfiguration(photoLibrary: PHPhotoLibrary.shared())
      configuration.filter = .images
      configuration.selectionLimit = 1
      configuration.preferredAssetRepresentationMode = .current

      let picker = PHPickerViewController(configuration: configuration)
      picker.delegate = self

      self.pendingPickerResolve = resolve
      self.pendingPickerReject = reject
      self.pendingPickerProjectId = projectId

      presenter.present(picker, animated: true)
    }
  }

  func picker(
    _ picker: PHPickerViewController,
    didFinishPicking results: [PHPickerResult]
  ) {
    picker.dismiss(animated: true)

    guard let result = results.first else {
      completePickerSelection(with: nil)
      return
    }

    let provider = result.itemProvider
    let projectId = pendingPickerProjectId ?? "project"

    guard provider.canLoadObject(ofClass: UIImage.self) else {
      rejectPickerSelection(
        code: "picker_load_failed",
        message: "Grado could not load the selected image.",
        error: nil
      )
      return
    }

    provider.loadObject(ofClass: UIImage.self) { [weak self] object, error in
      guard let self else { return }

      if let error {
        self.rejectPickerSelection(
          code: "picker_load_failed",
          message: "Grado could not load the selected image.",
          error: error
        )
        return
      }

      guard let image = object as? UIImage else {
        self.rejectPickerSelection(
          code: "picker_invalid_image",
          message: "Grado could not read the selected image.",
          error: nil
        )
        return
      }

      do {
        let previewPath = try self.writeCustomPreviewImage(
          image,
          projectId: projectId
        )
        self.completePickerSelection(with: previewPath)
      } catch {
        self.rejectPickerSelection(
          code: "picker_save_failed",
          message: "Grado could not save the selected image.",
          error: error
        )
      }
    }
  }

  @MainActor
  private static func topViewController(
    base: UIViewController? = {
      UIApplication.shared.connectedScenes
        .compactMap { $0 as? UIWindowScene }
        .flatMap(\.windows)
        .first(where: \.isKeyWindow)?
        .rootViewController
    }()
  ) -> UIViewController? {
    if let navigationController = base as? UINavigationController {
      return topViewController(base: navigationController.visibleViewController)
    }

    if let tabBarController = base as? UITabBarController {
      return topViewController(base: tabBarController.selectedViewController)
    }

    if let presentedViewController = base?.presentedViewController {
      return topViewController(base: presentedViewController)
    }

    return base
  }

  private func writeCustomPreviewImage(
    _ image: UIImage,
    projectId: String
  ) throws -> String {
    guard let jpegData = image.jpegData(compressionQuality: 0.92) else {
      throw NSError(
        domain: "GradoProjectPreview",
        code: 1,
        userInfo: [
          NSLocalizedDescriptionKey: "Grado could not encode the selected image."
        ]
      )
    }

    let outputURL = try makeCustomPreviewURL(projectId: projectId)
    try jpegData.write(to: outputURL, options: .atomic)
    return outputURL.path
  }

  private func makeCustomPreviewURL(projectId: String) throws -> URL {
    let fileManager = FileManager.default
    guard let documentsDirectory = fileManager.urls(
      for: .documentDirectory,
      in: .userDomainMask
    ).first else {
      throw NSError(
        domain: "GradoProjectPreview",
        code: 2,
        userInfo: [
          NSLocalizedDescriptionKey: "Grado could not open the preview directory."
        ]
      )
    }

    let previewDirectory = documentsDirectory.appendingPathComponent(
      "project-custom-previews",
      isDirectory: true
    )

    if !fileManager.fileExists(atPath: previewDirectory.path) {
      try fileManager.createDirectory(
        at: previewDirectory,
        withIntermediateDirectories: true
      )
    }

    let sanitizedProjectId = projectId.replacingOccurrences(
      of: "[^a-zA-Z0-9_-]",
      with: "_",
      options: .regularExpression
    )

    return previewDirectory.appendingPathComponent(
      "\(sanitizedProjectId)_\(Int(Date().timeIntervalSince1970 * 1000)).jpg"
    )
  }

  private func completePickerSelection(with value: String?) {
    Task { @MainActor in
      let resolve = self.pendingPickerResolve
      self.pendingPickerResolve = nil
      self.pendingPickerReject = nil
      self.pendingPickerProjectId = nil
      resolve?(value)
    }
  }

  private func rejectPickerSelection(
    code: String,
    message: String,
    error: Error?
  ) {
    Task { @MainActor in
      let reject = self.pendingPickerReject
      self.pendingPickerResolve = nil
      self.pendingPickerReject = nil
      self.pendingPickerProjectId = nil
      reject?(code, message, error)
    }
  }
}

private enum GradoVideoExporterModuleError: LocalizedError {
  case exportAlreadyInProgress

  var errorDescription: String? {
    switch self {
    case .exportAlreadyInProgress:
      return "Grado is already exporting a video."
    }
  }
}

@objc(GradoVideoExporter)
final class GradoVideoExporter: RCTEventEmitter {
  private let progressEventName = "GradoVideoExporterProgress"
  private let stateQueue = DispatchQueue(label: "com.grado.video-exporter")
  private var hasListeners = false
  private var activeExportSession: AVAssetExportSession?
  private var progressTimer: DispatchSourceTimer?

  override static func requiresMainQueueSetup() -> Bool {
    false
  }

  override func supportedEvents() -> [String]! {
    [progressEventName]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  @objc(exportVideo:filterId:filterMatrixPayload:filterIntensity:exportFormat:resolve:reject:)
  func exportVideo(
    _ sourceUri: String,
    filterId: String,
    filterMatrixPayload: String,
    filterIntensity: NSNumber,
    exportFormat: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task.detached(priority: .utility) { [weak self] in
      guard let self else { return }

      do {
        let renderer = await MainActor.run {
          GradoFilteredVideoView(frame: .zero)
        }

        let configuredExport = try await renderer.makeExportSession(
          sourceUri: sourceUri,
          filterId: filterId,
          filterMatrixPayload: filterMatrixPayload,
          filterIntensity: CGFloat(truncating: filterIntensity),
          exportFormat: exportFormat
        )

        try self.registerActiveExport(session: configuredExport.session)
        self.startProgressUpdates(for: configuredExport.session)

        defer {
          self.stopProgressUpdates()
          self.clearActiveExportState()
        }

        let outputPath = try await self.runExport(
          session: configuredExport.session,
          outputURL: configuredExport.outputURL
        )

        resolve(outputPath)
      } catch {
        reject("video_export_failed", error.localizedDescription, error)
      }
    }
  }

  @objc(cancelExport:reject:)
  func cancelExport(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    activeSession()?.cancelExport()
    resolve(nil)
  }

  private func runExport(
    session: AVAssetExportSession,
    outputURL: URL
  ) async throws -> String {
    try await withCheckedThrowingContinuation { continuation in
      session.exportAsynchronously {
        switch session.status {
        case .completed:
          continuation.resume(returning: outputURL.path)
        case .cancelled:
          continuation.resume(throwing: GradoVideoExportError.exportCancelled)
        case .failed:
          let message = session.error?.localizedDescription ?? "The export failed."
          continuation.resume(throwing: GradoVideoExportError.exportFailed(message))
        default:
          let message = session.error?.localizedDescription ?? "The export did not finish."
          continuation.resume(throwing: GradoVideoExportError.exportFailed(message))
        }
      }
    }
  }

  private func registerActiveExport(session: AVAssetExportSession) throws {
    try stateQueue.sync {
      if activeExportSession != nil {
        throw GradoVideoExporterModuleError.exportAlreadyInProgress
      }

      activeExportSession = session
    }
  }

  private func clearActiveExportState() {
    stateQueue.sync {
      activeExportSession = nil
    }
  }

  private func activeSession() -> AVAssetExportSession? {
    stateQueue.sync {
      activeExportSession
    }
  }

  private func startProgressUpdates(for session: AVAssetExportSession) {
    stopProgressUpdates()
    emitProgress(0)

    let timer = DispatchSource.makeTimerSource(queue: stateQueue)
    timer.schedule(deadline: .now(), repeating: .milliseconds(120))
    timer.setEventHandler { [weak self, weak session] in
      guard let self, let session else { return }
      self.emitProgress(session.progress)
    }

    stateQueue.sync {
      progressTimer = timer
    }

    timer.resume()
  }

  private func stopProgressUpdates() {
    let timer = stateQueue.sync { () -> DispatchSourceTimer? in
      let currentTimer = progressTimer
      progressTimer = nil
      return currentTimer
    }

    timer?.cancel()
  }

  private func emitProgress(_ progress: Float) {
    let clampedProgress = max(0, min(progress, 1))

    DispatchQueue.main.async { [weak self] in
      guard let self, self.hasListeners else { return }
      self.sendEvent(
        withName: self.progressEventName,
        body: ["progress": Double(clampedProgress)]
      )
    }
  }
}
