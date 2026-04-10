import { Component, inject, input } from '@angular/core';
import { BambuLabService } from '../../services/bambu-lab.service';
import { HassEntity } from '../../types';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss',
})
export class CameraComponent {
  private readonly bambuLab = inject(BambuLabService);

  readonly visible = input(false);
  readonly cameraEntity = input.required<HassEntity>();
  readonly toggleVideo = input.required<() => void>();


  get isMJPG(): boolean {
    const entity = this.cameraEntity();
    return !!entity && !!entity.attributes['access_token'];
  }

  get backgroundUrl(): string {
    if (!this.isMJPG) return 'none';
    const entity = this.cameraEntity();
    if (entity.test) {
      return `url('${entity.testUrl}')`;
    }
    return `url('${window.location.origin}/api/camera_proxy_stream/${entity.entity_id}?token=${entity.attributes['access_token']}')`;
  }

  get cameraTransform(): string {
    const config = this.bambuLab.config();
    if (!config) return '';
    const rotate = config.camera_rotate;
    const mirror = config.camera_mirror;
    if (rotate && mirror) return 'rotate(180deg) scaleX(-1)';
    if (rotate) return 'rotate(180deg)';
    if (mirror) return 'scaleX(-1)';
    return '';
  }

  onWrapperClick(): void {
    this.toggleVideo()();
  }
}

